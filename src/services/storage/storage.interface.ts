import { IPersistenceContainer } from '../../abstracts/persistence.container';

/**
 * An extension of the IPersistenceContainer that provides some extra functionality
 * that allows for more efficient management of keys and the ability to handle
 * null values in browser storage (ie, if the key exists, but null is returned, it's
 * null.  If the key does not exist, it's undefined.)
 * 
 * @export
 * @interface IStorage
 * @extends {IPersistenceContainer}
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export interface IStorage extends IPersistenceContainer {
    /**
     * Returns <code>true</code> if the storage type is available
     * 
     * @returns {boolean} 
     */
    available(): boolean;

    /**
     * Returns <code>true</code> if an item exists with the specified key
     * 
     * @param {string} key 
     * @returns {boolean} 
     */
    exists(key: string): boolean;

    /**
     * Returns a list of keys that have been saved using this Container.
     * 
     * @returns {string[]} 
     */
    keys(): string[];
}
