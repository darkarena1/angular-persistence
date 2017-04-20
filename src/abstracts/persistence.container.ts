/**
 * A container that uses the Angular Persistence Framework for storage.
 * A container is a name-spaced storage facility of like objects that
 * share the same persistence config.  The namespace used to construct
 * this Container should be unique and should not match any other attributes
 * stored by the system.
 * 
 * The PersistenceContainer can be created using the <code>
 * PersistenceService.createContainer</code>.
 * 
 * @export
 * @interface IPersistenceContainer
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export interface IPersistenceContainer {
    
    /**
     * Sets a value for a specified key inside of the current container.
     * 
     * @param {string} key the key representing the value
     * @param {any} value the value to store
     * 
     * @returns {boolean} true if the value was successfully stored
     */
    set (key: string, value: any): boolean;

    /**
     * Returns a value for the specified key inside of the keystore.
     * 
     * @param {string} key a key representing the value to return
     * @returns {any} the value for the specified key
     */
    get (key: string): any;
    
    /**
     * Clears the value assigned to the specified key within the
     * current containers namespace.
     * 
     * @param {string} key a key representing the value to remove
     * @returns {any} the value that has been removed from the cache
     */
    remove (key: string): any;

    /**
     * Clears the entire container of all its values.
     */
    removeAll (): void;
}
