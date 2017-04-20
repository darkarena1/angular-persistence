import { IPersistenceContainer } from "../../abstracts/persistence.container";

const INFO_KEY = '__INFO';

/**
 * An internal object used to track items saved by a storage object within the persistence
 * framework.
 * 
 * @export
 * @class ContainerInfo
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export class ContainerInfo {
    
    constructor(private _namespace: string, private _container: IPersistenceContainer) {
        let infoObj = _container.get(this._namespace);

        // If we have an existing object, check its type
        if (infoObj) {
            if (typeof infoObj !== 'object' || !infoObj[INFO_KEY]) {
                throw new Error('Potential attribute conflict detected');
            }    
        }
    }

    /**
     * Adds a key to this info object.
     * 
     * @param {string} key 
     */
    public addAttribute(key: string) {
        let item = this._getInfo();
        item[key] = true;
        this._setInfo(item);
    }

    /**
     * Removes a key from this info object.
     * 
     * @param {string} key 
     */
    public removeAttribute(key: string) {
        let info = this._getInfo();
        delete info[key];
        this._setInfo(info);
    }

    /**
     * Returns a list of keys that have been added to this
     * info object.
     * 
     * @returns {string[]} 
     */
    public getAttributes(): string[] {        
        return Object.keys(this._getInfo())
            .filter((key) => key !== INFO_KEY);
    }

    /**
     * Checks to see if the value stored in the _namespace
     * is an info object or if it is empty.  If it is NOT
     * an info object, then false is returned.
     * 
     * @returns {boolean} 
     */
    public available(): boolean {
        let infoObj = this._container.get(this._namespace);
        return !infoObj || (typeof infoObj === 'object' &&  infoObj[INFO_KEY]);
    }

    private _getInfo(): any {
        let obj = this._container.get(this._namespace);

        if (!obj) {
            obj = {};
            obj[INFO_KEY] = true;
        }

        return obj;
    }

    private _setInfo(info: any) {
        // this is 1 because the info identifier will be there.
        if (Object.keys(info).length <= 1) {
            this._container.remove(this._namespace);
        } else {
            this._container.set(this._namespace, info);
        }
    }
}
