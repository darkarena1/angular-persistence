import { Expirable } from './persistence.expirable';
import { Storable }  from './persistence.storable';

/**
 * A type definition for the cache config object used for caching and saves.
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export type PersistenceConfig = Expirable & Storable & {

    /**
     * This specifies that the current value is only good once,
     * and after it is retrieved, it will be removed from the
     * storage.
     */
    oneUse?: boolean;
}; 
