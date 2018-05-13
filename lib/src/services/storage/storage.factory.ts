import { SessionStorage } from './storage.session';
import { LocalStorage } from './storage.local';
import { ImmutableMemoryStorage } from './storage.immutable_memory';
import { MemoryStorage } from './storage.memory';
import { IStorage } from './storage.interface';
import { StorageType } from '../../constants/persistence.storage_type';

/**
 * A factory used to retrieve Storage objects
 *
 * @export
 * @class StorageFactory
 *
 * @author Scott O'Bryan
 * @since 1.0
 */
export class StorageFactory {

    private _storages: IStorage[] = [];

    /**
     * Returns a new instance of the storage factory.
     *
     * @static
     * @returns {StorageFactory}
     */
    public static getStorage(): StorageFactory {
        return new StorageFactory();
    }

    /**
     * Returns a singleton object of a specified type.  Storage
     * types are initialized lazily.
     *
     * @param {StorageType} type
     * @returns {IStorage}
     */
    public of(type: StorageType): IStorage {
        let storage = this._storages[type];

        if (!storage) {
            switch (type) {
                case StorageType.MEMORY:
                    storage = new MemoryStorage();
                    this._storages[type] = storage;
                    break;
                case StorageType.IMMUTABLE_MEMORY:
                    storage = new ImmutableMemoryStorage();
                    break;
                case StorageType.LOCAL:
                    storage = new LocalStorage();
                    break;
                case StorageType.SESSION:
                    storage = new SessionStorage();
                    break;
                default:
            }

            if ( !storage || !storage.available()) {
                throw new Error('Storage type not available');
            }

            this._storages[type] = storage;
        }

        return storage;
    }

}
