/**
 * Specifies the various storage types which are able to be used by the framework.
 * Each storage type has different persistence profile, performance profile, and
 * the type of objects is supports.
 *
 * @export
 * @enum {number}
 *
 * @author Scott O'Bryan
 * @since 1.0
 */
export enum StorageType {
    /**
     * This stores a value in memory.  It is the fastest storage type for performance
     * and it can store any object.  Objects stored in memory are mutable, which means
     * that changing information in the object will change to all references of that
     * object.  This profile will persist only as long as the service is active and
     * will not last beyond page reloads.
     */
    MEMORY,

    /**
     * This stores attributes in memory, just like the MEMORY storage type,
     * however objects are JSON Encoded before storage and JSON Encoded after storage.
     * This means that storage is limited to items that can be encoded using
     * JSON.stringify and mutating one instance of the stored value will not have 
     * side-effects on other items retrieved. 
     */
    IMMUTABLE_MEMORY,

    /**
     * This stores values in the browser's session storage if available.  The value
     * will persist, therefore, between page refreshes and reloads.  Each value
     * store is limited to the current tab in the browser.  As this storage uses
     * browser session storage, values are limited to the items that can be encoded
     * using JSON.stringify and mutating one instance of the stored value will not
     * have side-effects on the other items retrieved.
     */
    SESSION,

    /**
     * This stores values in the browser's local storage if available.  The value
     * will persist, therefore, until purged by the program or by the browser.
     * As memory will persist between page reloads and even browser reloads, it is
     * advised to use this storage sparingly.  This is ideal, however, for storing
     * information for offline storage.
     */
    LOCAL
}
