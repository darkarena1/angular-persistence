import { IPersistenceContainer } from '../../abstracts/persistence.container';

const NULL_VALUE = '_____NULL_VALUE_____';

/**
 * This is a container that wraps a browser storage object.
 * 
 * @export
 * @class BrowserContainer
 * @implements {IPersistenceContainer}
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export class BrowserContainer implements IPersistenceContainer {
    /**
     * Creates an instance of BrowserContainer.
     * @param {Storage} _storage 
     */
    constructor(private _storage: Storage) {
    }

    /**
     * Sets a value on the browser storage
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns {boolean} 
     */
    public set(key: string, value: any): boolean {
        try {
            if (value === null) {
                value = NULL_VALUE;
            }

            if (value === undefined) {
                this._storage.removeItem(key);
            } else {
                this._storage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Gets a value from browser storage
     * 
     * @param {string} key 
     * @returns {*} 
     */
    public get(key: string): any {
        let strval = this._storage.getItem(key);

        if (strval === null) {
            return undefined;
        }

        let value = JSON.parse(strval);

        if (value === NULL_VALUE) {
            return null;
        }

        return value;
    }

    /**
     * Removes a value from browser storage
     * 
     * @param {string} key 
     * @returns {*} 
     */
    public remove(key: string): any {
        let curVal = this.get(key);

        if (curVal !== undefined) {
            this._storage.removeItem(key);
        }

        return curVal;
    }

    /**
     * Removes all values from browser storage
     */
    public removeAll(): void {
        this._storage.clear();
    }
}
