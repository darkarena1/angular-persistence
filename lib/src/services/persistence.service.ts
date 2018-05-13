
import {filter} from 'rxjs/operators';
import { Injectable, EventEmitter }                  from '@angular/core';
import { Observer, Subscriber, Subject ,  Observable } from 'rxjs';

import { CacheImpl }                                 from './persistence.cache-impl';
import { IStorage }                                  from './storage/storage.interface';
import { SubStorage }                                from './storage/storage.sub_storage';
import { StorageFactory }                            from './storage/storage.factory';
import { StorageType }                               from '../constants/persistence.storage_type';
import { PersistenceConfig }                         from '../types/persistence.config';
import { ItemDefinition }                            from '../types/persistence.item_definition';
import { CacheConfig }                               from '../types/persistence.cache_config';
import { IPersistenceContainer }                     from '../abstracts/persistence.container';
import { ICache }                                    from '../abstracts/persistence.cache';


/**
 * Service used to persist application wide storage.  Iterms may be obtained from the Service
 * itself or used through proxies.  This framework also supports an immutable flag which will
 * instruct the service that the objects stored within should not have any side-effects when
 * objects on the outside are changed.
 *
 * Note on immutability: Only clonable objects will be saved when the immutable flag is
 * set.  This framework will do a deep clone of the objects in question, but items such
 * as functions will not be preserved.  Also, immutability is slower.  If you have objects
 * that are well controlled with a single component, it is suggested that you don't save your
 * item as immutable.
 *
 * @export
 * @class PersistenceService
 *
 * @author Scott O'Bryan
 * @since 1.0
 */
@Injectable()
export class PersistenceService {
    private _emitter = new EventEmitter<ItemDefinition>();
    private _storage: StorageFactory = StorageFactory.getStorage();

    /**
     * Returns a hot observable that can be used to monitor changes to this framework over
     * time.  Subscribing to this observable has the potential of causing memory leaks,
     * so each subscriber is expected to unsubscribe when notifications are no longer
     * needed.
     * 
     * @param {ItemDefinition} [config] the config object that can be used to filter the 
     *                                  results.  If not provided, all changes will be
     *                                  returned.
     * 
     * @returns {Observable<ItemDefinition>} a hot observable that can monitor changes 
     *                                  to this framework over time.
     */
    public changes(config: ItemDefinition = {}): Observable<ItemDefinition> {
        let observable = this._emitter.asObservable();

        // apply the key filter
        if (config.key) {
            observable = observable.pipe(filter((val) => val.key === config.key));
        }

        // apply the type filter
        if (config.type) {
            observable = observable.pipe(filter((val) => val.type === config.type));
        }

        return observable;
    }

    /**
     * Returns an object from storage.  If the object was stored with the immutable flag
     * set, then the object returned will not have any side-effects into the stored model
     * until it is set again.
     * 
     * @param {string} key a string represnting the stored value
     * @param {StorageType} [type=StorageType.MEMORY] the storage type
     * @returns {*} the value or undefined if the object is not set
     */
    public get(key: string, type: StorageType = StorageType.MEMORY): any {
        let storage = this._getStorage(type);
        let value = storage.get(key);

        // the value here will actually be an object with some metadata attached.  This
        // is done to handle immutable and some other things.
        if (value) {
            let currDate = Date.now();

            // if we have a value, we need to check to see if its expired.
            if (value.expireAfter && value.created + value.expireAfter < currDate ) {
                storage.remove(key);
                this._emitter.emit({ key, type });
                return undefined;
            }

            // handle the oneUse configuration
            if ( value.oneUse ) {
                storage.remove(key);
                this._emitter.emit({ key, type });
                return value.data;
            }

            // if maxAge then we need to update the expires tag
            if ( value.timeout ) {
                if ( value.lastAccessed + value.timeout < currDate ) {
                    storage.remove(key);
                    this._emitter.emit({ key, type });
                    return undefined;
                } else {
                    value.lastAccessed = currDate;
                    storage.set(key, value);
                }
            }

            return value.data;
        }

        return undefined;
    }

    /**
     * Puts an object into storage, replacing any item that may be in there.  By default, 
     * the object is stored as-is, which means that when other areas of code get the 
     * object, they can mutate it.
     * 
     * As immutable storage is slower, and the reconstituted logic may be
     * missing functions or metadata, it is recommended to use this only
     * if you need to ensure the integrity of the stored object on each set
     * as might be the case if you make use of the "change" emitter.
     * 
     * @param {string} key the key that will represent the value
     * @param {*} value the value to store
     * @param {PersistenceConfig} [config={}] any additional configuration
     * @returns {boolean} which is <code>true</code> if the value was stored successfully
     */
    public set( key: string, value: any, config: PersistenceConfig = {}): boolean {
            
        if (!config.type) {
            config.type = StorageType.MEMORY;
        }

        if (!value === undefined) {
            this.remove(key);
            this._emitter.emit({key, type: config.type});
            return true;
        }

        let storage = this._getStorage(config.type);

        let currDate = Date.now();
        let success = storage.set(key, {
            data: value,
            expireAfter: config.expireAfter,
            timeout: config.timeout,
            oneUse: config.oneUse ? true : false,
            created: currDate,
            lastAccessed: currDate
        });

        // happens if the info object or storage object cannot be saved.
        // Ensure we have cleaned up.
        if (success) { 

             // this seems kind of wierd, but if we are using an immutable 
             // storage type, we want the emitter
            this._emitter.emit({key, type: config.type});
        } else {
            storage.remove(key);
        }

        return success;
    }

    /**
     * Clears a value stored in the service for the given type.
     * 
     * @param {string} key  the key of the stored value
     * @param {StorageType} [type=StorageType.MEMORY] the type of storage used
     * @returns {*} the item that was removed (if any)
     */
    public remove(key: string, type: StorageType = StorageType.MEMORY): any {
        let storage = this._getStorage(type);
        let currentItem = this.get(key, type);
        if (currentItem !== undefined) {
            storage.remove(key);
            this._emitter.emit({key, type});
        }
        return currentItem;
    }

    /**
     * Clears all stored items for a particular storage type.
     * 
     * @param {StorageType} [type=StorageType.MEMORY] the type of storage to clear
     */
    public removeAll(type: StorageType = StorageType.MEMORY): void {
        let keys = this._getStorage(type).keys();
        this._getStorage(type).removeAll();
        keys.forEach((key: string) => this._emitter.emit({key, type}));
    }

    /**
     * Cleans up any expired objects in the cache.
     * 
     * @param {StorageType} [type=StorageType.MEMORY] the type of storage to clean
     */
    public clean(type: StorageType = StorageType.MEMORY): void {
        let storage = this._getStorage(type);
        let keys = storage.keys();
        let currDate = Date.now();

        for (let key of keys) {
            let item = storage.get(key);
            // if we have a value, we need to check to see if its expired.
            if (item && 
                (
                    (item.expireAfter && item.created + item.expireAfter < currDate ||
                    item.timeout && item.lastAccessed + item.timeout < currDate)
                )
            ) {
                this.remove(key);
            }
        }
    }

    /**
     * Create a property on the object that is bound to this stored value.  This method
     * requires ES5 compatibility and the property will have special rules associated 
     * with it.  The name of the property will be "key", and the value stored in the
     * configured storage will be prefix + key.
     * 
     * @template T the type of property
     * @param {*} obj the object where the property will be bound to
     * @param {string} propName the name of the property to be bound
     * @param {string} key the key used for the storage of the item
     * @param {PersistenceConfig} [config={}] any additional configuration
     */
    public defineProperty<T> (obj: any, propName: string, key: string, config: PersistenceConfig = {}): void {
        let type = config.type || StorageType.MEMORY;

        Object.defineProperty(obj, propName, {
            enumerable: true,
            configurable: true,
            get: (): T => { return this.get(key, type); },
            set: (val: T): void => { this.set(key, val, config); }
        });
    }

    /**
     * Returns a facade that makes things a bit easier when interacting with the service.
     * The facade will use the prefix in order to isolate they keystore.  If no prefix is
     * defined, the keystore will be mapped as usual with the keys working as-is in the
     * storage.
     * 
     * @param config the config for the facade
     * @param prefix the prefix to use for isolation of the storage
     *
     * @return a PersistenceFacade object representing this store
     */
    public createContainer(namespace: string, config: PersistenceConfig = {}): IPersistenceContainer {
        const thisService = this;
        let myConfig: PersistenceConfig = {
            oneUse: config.oneUse,
            expireAfter: config.expireAfter,
            timeout: config.timeout,
            type: config.type || StorageType.MEMORY
        };

        // Return a substorage of the service so the full config can be used.
        return new SubStorage(namespace, {
            get: (key: string): any => {
                return thisService.get(key, myConfig.type);
            },

            set: (key: string, value: any): boolean => {
                return thisService.set(key, value, myConfig);
            },

            remove: (key: string): any => {
                return thisService.remove(key, myConfig.type);
            },

            removeAll: (): void => {
                return thisService.removeAll();
            }
        }, true);
 
    }

    /**
     * Returns a cache proxy that makes interacting with this service a little bit easier.  The
     * proxy returned will have a set key, a generic loader, and a consistent set of config
     * parameters. Please note that the "expires" property of the config might have unforseen
     * side-effects to the cache in that if the expires setting is already passed, the cache will
     * no longer cache values until a new proxy is created.
     * 
     * @param key    they key for the item in the persistence layer
     * @param loader the function to load the intiial value.  Must return either a value or 
     *               an Observable of that value.  If an observable is returned, it will be
     *               converted into a single by this method and returned to the subscriber.
     * @param config optional config object used to "set" the value if it has not already
     *               been loaded.  If a "type" is not specified, memory storage will be 
     *               used.  
     * 
     * @returns a CacheProxy that can be used to interact with this cache.
     */
    public createCache<T>(
        key: string,
        loader: () => T | Observable<T>,
        config: CacheConfig = {} 
    ): ICache<T> {
        // for safety ensure that oneUse is not present.  It shouldn't be, but sometimes
        // typescript doesn't always catch errors
        let myConfig: CacheConfig = {
            type: config.type || StorageType.MEMORY,
            expireAfter: config.expireAfter,
            timeout: config.timeout
        };

        return new CacheImpl(key, loader, this, myConfig);
    }

    private _getStorage(type: StorageType): IStorage {
        return this._storage.of(type);
    }

    private _calculateExpires(maxAge: number) {
        return maxAge ? Date.now() + maxAge : undefined;
    }
}
