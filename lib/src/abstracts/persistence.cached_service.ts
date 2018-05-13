
import {map} from 'rxjs/operators';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Resolve,
    RouterStateSnapshot
    } from '@angular/router';
import { Observable } from 'rxjs';
import { ICache } from './persistence.cache';
import { PersistenceService } from '../services/persistence.service';

/**
 * This is a cache that also implements the <code>CanActivate</code> and <code>Resolve<T></code>
 * interfaces in angular so that it can be used as both a provider and a set of guards for Angular
 * routing.  By implementing the abstract <code>getCache<T></code> method using a cache object,
 * this abstract class can form the foundation for a service based off of the persistence framework.
 *
 * @export
 * @abstract
 * @class AbstraceCachedService
 * @implements {ICache<T>}
 * @implements {CanActivate}
 * @implements {Resolve<T>}
 * @template T - the type of value returned by this service.
 *
 * @author Scott O'Bryan
 * @since 1.0
 */
export abstract class AbstractCachedService<T> implements ICache<T>, CanActivate, Resolve<T> {

    /**
     * Returns an {Observable<T>} which will monitor changes to the
     * cache over a period of time.  This is a hot, multi-value
     * observable which will emit the cached value, if one exists,
     * when the Observable is first subscribed to.  The observer will
     * then emit a new event each time the cache changes.
     *
     * As this is a multi-value observer which is not expected to
     * complete, it is the responsiblity of the subscriber to
     * unsubscribe in order to prevent potential memory leaks.
     *
     * @returns {Observable<T>} which will emit an event whenever
     *          the value in the cache changes
     */
    public changes(): Observable<T> {
        return this.getCache().changes();
    }


    /**
     * Returns an {Observable<T>} to a cached value if one is loaded
     * or to the value specified by the loader that was supplied when
     * this cache was created if it is not.
     *
     * This Observable is guarenteed to be a single observable which
     * means it returns a single value before it completes.  As such
     * you do not have to unsubscribe from this Observable.
     *
     * @returns {Observable<T>} of type T that will contain the
     *          value.
     */
    public get(): Observable<T> {
        return this.getCache().get();
    }

    /**
     * Manually clears the value in the cache forcing a reload.
     *
     * @abstract
     */
    public clear(): void {
        return this.getCache().clear();
    }

    /**
     * Returns the observable to the current cached service for use in the angular Router.
     * This is equivalent to the get method but implements the resolve interface for the
     * Angular Router.
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<T>}
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
        return this.get();
    }

    /**
     * Returns true if the value of the cached observable is "truthy" and false if it is not.
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<boolean>}
     *
     * @memberOf AbstraceCachedService
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.get().pipe(map((val) => val ? true : false));
    }


    /**
     * Returns a cache that this service will use to return values.  The Cache may be obtained
     * from the PersistenceService or it may be a custom implementation should one be needed.
     *
     * @protected
     * @abstract
     * @template T
     * @returns {ICache<T>}
     */
    protected abstract getCache(): ICache<T>;
}
