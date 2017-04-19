import { IStorage } from './storage.interface';

/**
 * A storage type which stored values in memory.  They are assumed to be mutable, but
 * any object will work in this storage type.
 * 
 * @export
 * @class MemoryStorage
 * @implements {IStorage}
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export class MemoryStorage implements IStorage {
    private _data: {[key: string]: any} = {};

    /**
     * Always returns true
     * 
     * @returns {boolean} 
     */
    public available(): boolean {
        return true;
    }
    
    /**
     * Sets a value in this object for the specified key
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns {boolean} 
     */
    public set(key: string, value: any): boolean {
        if (value === undefined) {
            delete this._data[key];
        } else {
            this._data[key] = value;
        }
        return true;
    }
    
    /**
     * Returns the value of the specified key
     * 
     * @param {string} key 
     * @returns 
     */
    public get(key: string) {
        return this._data[key];
    }
    
    /**
     * Returns false if the value for the key is undefined.
     * 
     * @param {*} key 
     * @returns {boolean} 
     */
    public exists(key: any): boolean {
        return this._data[key] !== undefined;
    }
    
    /**
     * Removes a value from this object
     * 
     * @param {*} key 
     */
    public remove(key: any) {
        delete this._data[key];
    }

    /**
     * Removes all values in this storage type.
     * 
     * @returns {string[]} 
     */
    public removeAll(): string[] {
        let keys = Object.keys(this._data);
        this._data = {};

        return keys;
    }
    
    /**
     * Returns a list of all keys that are stored
     * 
     * @returns {string[]} 
     */
    public keys(): string[] {
        return Object.keys(this._data);
    }

}
