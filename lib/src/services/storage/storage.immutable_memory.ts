import { MemoryStorage } from './storage.memory';

/**
 * Storage type for immutable memory
 *
 * @export
 * @class ImmutableMemoryStorage
 * @extends {MemoryStorage}
 *
 * @author Scott O'Bryan
 * @since 1.0
 */
export class ImmutableMemoryStorage extends MemoryStorage {
    /**
     * Sets a value in memory storage after stringifying the object.  This
     * add some overhead but ensures each copy of the object is immutable.
     *
     * @param {string} key
     * @param {*} value
     * @returns {boolean}
     */
    public set(key: string, value: any): boolean {
        if (value !== undefined) {
            value = JSON.stringify(value);
        }

        return super.set(key, value);
    }

    /**
     * Returns an immutable value for the specified key.
     *
     * @param {string} key
     * @returns {*}
     */
    public get(key: string): any {
        const value = super.get(key);
        if (value !== undefined) {
            return JSON.parse(value);
        }
        return undefined;
    }
}
