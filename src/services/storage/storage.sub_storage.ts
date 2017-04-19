import { IStorage }              from './storage.interface';
import { ContainerInfo }         from './storage.container_info';
import { IPersistenceContainer } from '../../abstracts/persistence.container';

/**
 * This is an internal implementation of a storage container.  It takes a PersistenceContainer 
 * (which has a subset of the functionality) and straps on an info object to keep track of 
 * items that are added to the container.  This class can be used for creating storage
 * containers within other storage containers. 
 * 
 * @export
 * @class PersistenceContainerImpl
 * @implements {IPersistenceContainer}
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export class SubStorage implements IStorage {
    private _info: ContainerInfo;

    /**
     * Creates an instance of SubStorage.
     * @param {string} _namespace 
     * @param {IPersistenceContainer} _root 
     * @param {boolean} [_available=true] 
     */
    constructor(private _namespace: string, private _root: IPersistenceContainer, private _available = true) {
        this._info = new ContainerInfo(_namespace, _root);
    }

    /**
     * Sets a value
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns {boolean} 
     */
    public set(key: string, value: any): boolean {
        if (!this._available) {
            return false;
        }

        let val = this._root.set(this._getNamespacedKey(key), value);
        this._info.addAttribute(key);
        return val;
    }

    /**
     * Returns a value for a given key
     * 
     * @param {string} key 
     * @returns {*} 
     */
    public get(key: string): any {
        if (!this._available) {
            return undefined;
        }

        let val = this._root.get(this._getNamespacedKey(key));

        if (val === undefined) {
            this._info.removeAttribute(key);
        }

        return val;
    }

    /**
     * Removes a value for a given key
     * 
     * @param {string} key 
     * @returns {*} 
     */
    public remove(key: string): any {
        if (!this._available) {
            return undefined;
        }

        this._info.removeAttribute(key);
        return this._root.remove(this._getNamespacedKey(key));
    }

    /**
     * Removes any values which have been stored using this subStorage
     * container. 
     */
    public removeAll(): void {
        this._info.getAttributes().forEach( (element) => { this.remove(element); });
    }

    /**
     * Returns true if the parent storage object is available and if the
     * available flag was set durring instantiation
     * 
     * @returns {boolean} 
     */
    public available(): boolean {
        return this._available && this._info.available();
    }

    /**
     * Returns true if the value is not undefined
     * 
     * @param {string} key 
     * @returns {boolean} 
     */
    public exists(key: string): boolean {
        // This will also make sure the info object is up to date.
        return this.get(key) !== undefined;
    }

    /**
     * Returns a list of un-namespaced keys that have been returned by this object.
     * 
     * @returns {string[]} 
     */
    public keys(): string[] {
        // The exists will update the underlying storage object because
        // it invokes a get.  Still, we have an attributes object that is
        // not tied to the object in storage, hopefully.
        return this._info.getAttributes().filter((key) => {
            return this.exists(key);
        });
    }

    private _getNamespacedKey(key: string): string {
        return this._namespace + ':' + key;
    }
}
