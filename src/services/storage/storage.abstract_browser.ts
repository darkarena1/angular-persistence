import { BrowserContainer }      from './storage.browser_container';
import { ContainerInfo }         from './storage.container_info';
import { SubStorage }            from './storage.sub_storage';
import { IStorage }              from './storage.interface';
import { IPersistenceContainer } from '../../abstracts/persistence.container';

const PREFIX = 'ANGULAR_PERSISTENCE_STORAGE';

/**
 * An insternal class which implements the IStorage interface using the SubStorage implementation
 * object and it's implementation of the info object.
 * 
 * @export
 * @abstract
 * @class AbstractBrowserStorage
 * @extends {SubStorage}
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export abstract class AbstractBrowserStorage extends SubStorage {
    constructor(storage: Storage) {
        super(PREFIX, new BrowserContainer(storage), (storage) ? true : false);
    }
}
