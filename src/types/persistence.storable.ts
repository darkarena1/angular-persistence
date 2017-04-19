import { StorageType } from '../constants/persistence.storage_type';

/**
 * Storable items can have a type or use the memory storage type as a
 * default.
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export type Storable = {
    type?: StorageType;
};