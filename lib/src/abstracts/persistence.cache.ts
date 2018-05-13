import { Observable } from 'rxjs';

/**
 * A caching system that uses the Angular Persistence framework for storage.
 * A cache is a persistence store that contains a single attribute value.  This
 * value is automatically reloaded when the cache no longer contains any values
 * either through some sort of expiration or by manually clearing the value
 * via the <codel>Cache.clear</code> method.  Cache's support expireAfter and Timeout
 * configuration options and may be stored in any of the persistent data stores.
 *
 * To get ahold of this cache, use <code>PersistenceService.createCache</code>.
 *
 * @export
 * @interface ICache
 * @template T - they type of value contained in the cache.
 *
 * @author Scott O'Bryan
 * @since 1.0
 */
export interface ICache<T> {

    /**
     * Returns an Observable to a cached value if one is loaded or to the
     * value specified by the loader that was supplied when this cache was
     * created if it is not.
     *
     * This Observable is guarenteed to be a single observable which
     * means it returns a single value before it completes.  As such
     * you do not have to unsubscribe from this Observable.
     *
     * @returns {Observable<T>} of type T that will contain the
     *          value.
     */
    get(): Observable<T>;

    /**
     * Returns an Observable which will monitor changes to the cache
     * over a period of time.  This is a hot, multi-value observable which
     * will emit the cached value, if one exists, when the Observable is
     * first subscribed to.  The observer will then emit a new event each
     * time the cache changes.
     *
     * As this is a multi-value observer which is not expected to complete,
     * it is the responsiblity of the subscriber to unsubscribe in order to
     * prevent potential memory leaks.
     *
     * @returns {Observable<T>} which will emit an event whenever
     *          the value in the cache changes
     */
    changes(): Observable<T>;


    /**
     * Manually clears the value in the cache forcing a reload.
     */
    clear(): void;
}
