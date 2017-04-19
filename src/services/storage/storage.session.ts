import { AbstractBrowserStorage } from './storage.abstract_browser';

/**
 * Storage object which saves information to the browser session storage.
 * 
 * @export
 * @class SessionStorage
 * @extends {AbstractBrowserStorage}
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export class SessionStorage extends AbstractBrowserStorage {
    constructor() {
        super(sessionStorage);
    }
}
