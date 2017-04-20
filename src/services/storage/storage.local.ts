import { AbstractBrowserStorage } from './storage.abstract_browser';

/**
 * A storage object using local storage for persistence
 * 
 * @export
 * @class LocalStorage
 * @extends {AbstractBrowserStorage}
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export class LocalStorage extends AbstractBrowserStorage {

    /**
     * Creates an instance of LocalStorage.
     */
    constructor() {
        super(localStorage);
    }
}
