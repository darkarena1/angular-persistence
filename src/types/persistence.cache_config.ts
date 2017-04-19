import { Expirable } from './persistence.expirable';
import { Storable }  from "./persistence.storable";

/**
 * An interface for the cache config object used for caching and saves.
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export type CacheConfig = Expirable & Storable;