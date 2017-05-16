import { Observable } from 'rxjs';
import { ICache } from '../abstracts/persistence.cache';
import { StorageType } from '../constants/persistence.storage_type';
import { PersistenceService } from '../services/persistence.service';
import { CacheConfig } from '../types/persistence.cache_config';

/**
 * Internal class which is an implementation of the ICache interface. This is 
 * intended to be a private class for framework use only and will not be 
 * exported by the libraries modules.
 * 
 * @export
 * @class CacheImpl
 * @implements {ICache<T>}
 * @template T the type of value being cached
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export class CacheImpl<T> implements ICache<T> {
    private _value: T | undefined;
    private _cachedObservable: Observable<T> | undefined;
    private _changes: Observable<T>;

    /**
     * Creates an instance of CacheImpl.
     * @param {string} key 
     * @param {(() => T | Observable<T>)} _loader 
     * @param {PersistenceService} service 
     * @param {CacheConfig} [config] 
     */
    constructor (
        key: string,
        private _loader: () => T | Observable<T>,
        service: PersistenceService,
        config: CacheConfig = {}
    ) {
        let type = config.type || StorageType.MEMORY;

        // For safety sake, ensure that oneUse is not present in configuration
        service.defineProperty(this, "_value", key, config);

        this._changes = service.changes({key, type })
            .map((def) => this._value)
            .publishBehavior(this._value)
            .refCount();
    }
    
    /**
     * Returns an observable to a cached value if one is loaded or 
     * to the value specified by the loader that was supplied when 
     * this cache was created if it is not.
     * 
     * @returns {Observable<T>} an Observable of type T that will return a 
     *         single value when it's available before marking the stream 
     *         as complete.
     */
    public get(): Observable<T> {
        let result = this._value;

        if (result === undefined) {
            /*
             * smo - if we do not have a result, then we might still have an observable from
             * a previous call loaded in memory cache.
             */
            let observable = this._cachedObservable;

            if (observable === undefined) {
                let loaded = this._loader();

                if (loaded && loaded instanceof Observable) {
                    let newObservable = (loaded as Observable<T>)
                        .publishLast()
                        .refCount()
                        .do((value) => this._value = value)
                        .do((value) => this._cachedObservable = undefined);
                    
                    // cache the observable before publishing
                    this._cachedObservable = newObservable;
                    return newObservable;
                } else {
                    // static values simply get assigned immedietly
                    result = loaded as T;
                    this._value = result;
                }
            } else {
                return observable;
            }
        }

        // We have a real value so we need to make an observable that returns said value
        return Observable.of(result);
    }

    /**
     * A hot observable returning changes over time.
     * 
     * @returns {Observable<T>} 
     */
    public changes(): Observable<T> {
        return this._changes;
    }

    /**
     * Clears the cached value forcing a reload.
     */
    public clear(): void {
        this._value = undefined;
    }
}

