import { Subscriber } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { PersistenceService }     from '../src/index';
import { StorageType }            from '../src/index';

describe('PersistenceServiceTest: Memory', () => {
    let service: PersistenceService;

    beforeEach(() => {
        service = new PersistenceService();
    });

    afterEach(() => {
        service = null;
    });

    it("Should persist value in memory state", () => {
        service.set('abc123', 'TESTVAL');
        expect(service.get('abc123')).toBe('TESTVAL');
    });

    it("Should not persist value on new object", () => {
        expect(service.get('abc123')).toBeUndefined();
    });

    it("Should remove persisted value in memory state", () => {
        service.set('abc123', 'TESTVAL');
        service.remove('abc123');
        expect(service.get('abc123')).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        service.set('abc123', undefined);
        expect(service.get('abc123')).toBeUndefined();
    });

    it("Should removeAll when instructed", () => {
        service.set('abc123', 'TESTVAL');
        service.set('def456', 'TESTVAL');
        service.removeAll();
        expect(service.get('abc123')).toBeUndefined();
        expect(service.get('def456')).toBeUndefined();
    });

    it("Should persist null value`", () => {
        service.set('abc123', null);
        expect(service.get('abc123')).toBeNull();
    });

    it("Should return persisted value on first use with oneUse flag set", () => {
        service.set('abc123', 'TESTVAL', {oneUse: true});
        expect(service.get('abc123')).toBe('TESTVAL');        
    });

    it("Should return undefined on second use with oneUse flag set", () => {
        service.set('abc123', 'TESTVAL', {oneUse: true});
        service.get('abc123');
        expect(service.get('abc123')).toBeUndefined();        
    });

    it("Should mutate object in storage", () => {
        service.set('abc123', {mutated: false});
        let obj = service.get('abc123');
        obj.mutated = true;
        expect(service.get('abc123')).toEqual({mutated: true});
    });
});

describe('PersistenceServiceTest: ImmutableMemory', () => {
    let service: PersistenceService;

    beforeEach(() => {
        service = new PersistenceService();
    });

    afterEach(() => {
        service = null;
    });

    it("Should persist value", () => {
        service.set('abc123', 'TESTVAL', {type: StorageType.IMMUTABLE_MEMORY});
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBe('TESTVAL');
    });

    it("Should not persist value on new object", () => {
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBeUndefined();
    });

    it("Should remove persisted value", () => {
        service.set('abc123', 'TESTVAL', {type: StorageType.IMMUTABLE_MEMORY});
        service.remove('abc123', StorageType.IMMUTABLE_MEMORY);
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        service.set('abc123', undefined, {type: StorageType.IMMUTABLE_MEMORY});
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBeUndefined();
    });

    it("Should persist null value`", () => {
        service.set('abc123', null, {type: StorageType.IMMUTABLE_MEMORY});
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBeNull();
    });

    it("Should not mutate object in storage", () => {
        service.set('abc123', {mutated: false}, {type: StorageType.IMMUTABLE_MEMORY});
        let obj = service.get('abc123', StorageType.IMMUTABLE_MEMORY);
        obj.mutated = true;
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toEqual({mutated: false});
    });
});

describe('PersistenceServiceTest: SessionStorage', () => {
    let service: PersistenceService;
        
    beforeAll(() => {
        sessionStorage.clear();
    });

    beforeEach(() => {
        service = new PersistenceService();
    });

    afterEach(() => {
        service = null;
    });

    it("Should persist value", () => {
        service.set('abc123', 'TESTVAL', {type: StorageType.SESSION});
        expect(service.get('abc123', StorageType.SESSION)).toBe('TESTVAL');
    });

    it("Should persist value on new object", () => {
        expect(service.get('abc123', StorageType.SESSION)).toBe('TESTVAL');
    });
    
    it("Should remove persisted value", () => {
        service.set('abc123', 'TESTVAL', {type: StorageType.SESSION});
        service.remove('abc123', StorageType.SESSION);
        expect(service.get('abc123', StorageType.SESSION)).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        service.set('abc123', undefined, {type: StorageType.SESSION});
        expect(service.get('abc123', StorageType.SESSION)).toBeUndefined();
    });

    it("Should persist null value`", () => {
        service.set('abc123', null, {type: StorageType.SESSION});
        expect(service.get('abc123', StorageType.SESSION)).toBeNull();
    });

    it("Should not mutate object in storage", () => {
        service.set('abc123', {mutated: false}, {type: StorageType.SESSION});
        let obj = service.get('abc123', StorageType.SESSION);
        obj.mutated = true;
        expect(service.get('abc123', StorageType.SESSION)).toEqual({mutated: false});
        service.remove('abc123', StorageType.SESSION);
    });
});

describe('PersistenceServiceTest: LocalStorage', () => {

    let service: PersistenceService;

    beforeAll(() => {
        localStorage.clear();
    });

    beforeEach(() => {
        service = new PersistenceService();
    });

    afterEach(() => {
        service = null;
    });

    it("Should persist value", () => {
        service.set('abc123', 'TESTVAL', {type: StorageType.LOCAL});
        expect(service.get('abc123', StorageType.LOCAL)).toBe('TESTVAL');
    });

    it("Should persist value on new object", () => {
        expect(service.get('abc123', StorageType.LOCAL)).toBe('TESTVAL');
    });
    
    it("Should remove persisted value", () => {
        service.set('abc123', 'TESTVAL', {type: StorageType.LOCAL});
        service.remove('abc123', StorageType.LOCAL);
        expect(service.get('abc123', StorageType.LOCAL)).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        service.set('abc123', undefined, {type: StorageType.LOCAL});
        expect(service.get('abc123', StorageType.LOCAL)).toBeUndefined();
    });

    it("Should persist null value`", () => {
        service.set('abc123', null, {type: StorageType.LOCAL});
        expect(service.get('abc123', StorageType.LOCAL)).toBeNull();
    });


    it("Should not mutate object in storage", () => {
        service.set('abc123', {mutated: false}, {type: StorageType.LOCAL});
        let obj = service.get('abc123', StorageType.LOCAL);
        obj.mutated = true;
        expect(service.get('abc123', StorageType.LOCAL)).toEqual({mutated: false});
        service.remove('abc123', StorageType.LOCAL);
    });
});

describe('PersistenceServiceTest: expires and maxAge', () => {
    let service: PersistenceService;

    beforeEach(() => {
        service = new PersistenceService();
    });

    afterEach(() => {
        service = null;
    });

    it("Should persist if expires has not been reached", () => {
        service.set('abc123', 'TESTVAL', {expireAfter: 100});
        expect(service.get('abc123')).toBe('TESTVAL');
        expect(service.get('abc123')).toBe('TESTVAL');
    });

    it("Should remove persisted value if expires has been reached", (done) => {
        service.set('abc123', 'TESTVAL', {expireAfter: 100});
        setTimeout ( () => {
            expect(service.get('abc123')).toBeUndefined();
            done();
        }, 150);
    });

    it("Should remove persisted value if getting a value after maxAge has been reached", (done) => {
        service.set('abc123', 'TESTVAL', {timeout: 100});
        setTimeout ( () => {
            expect(service.get('abc123')).toBeUndefined();
            done();
        }, 150);
    });
});

describe('PersistenceServiceTest: changeListener', () => {
    let service: PersistenceService;
    let callback: any;

    beforeEach(() => {
        service = new PersistenceService();
        callback = jasmine.createSpy('callback');
    });

    afterEach(() => {
        service = null;
        callback = null;
    });

    it("Should not call callback on subscription", () => {
        service.changes().subscribe(callback);
        expect(callback).not.toHaveBeenCalled();
    });

    it("Should call callback on change", () => {
        service.changes().subscribe(callback);
        service.set('abc', '123');
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'abc'});
    });

    it("Should not call callback on change, multiple values", () => {
        service.changes().subscribe(callback);
        service.set('abc', '123');
        service.set('def', '123');
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'abc'});
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'def'});
    });

    it("Should not call callback filtered change", () => {
        service.changes({key: 'abc'}).subscribe(callback);
        service.set('abc', '123');
        service.set('def', '123');
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'abc'});
        expect(callback).not.toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'def'});
    });

    it("Should call callback on remove", () => {
        service.set('abc', '123');
        service.changes().subscribe(callback);
        service.remove('abc');
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'abc'});
    });

    it("Should not call callback on removal of undefined attribute", () => {
        service.changes({key: 'abc'}).subscribe(callback);
        service.remove('abc');
        expect(callback).not.toHaveBeenCalled();
    });

    it("Should call callback on removal of defined attribute", () => {
        service.set('abc', '123');
        service.changes({key: 'abc'}).subscribe(callback);
        service.remove('abc');
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'abc'});
    });

    it("Should call callback on setting of event with same value", () => {
        service.changes().subscribe(callback);
        service.set('abc', '123');
        service.set('abc', '123');
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it("Should call callback for each value on removeAll", () => {
        service.set('abc', '123');
        service.set('def', '123');
        service.changes().subscribe(callback);
        service.removeAll();
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'abc'});
        expect(callback).toHaveBeenCalledWith({type: StorageType.MEMORY, key: 'def'});
    });
});