import { PersistenceService, StorageType, IPersistenceContainer } from '../src/index';

describe('Persistent Container Test: Memory', () => {
    let service: PersistenceService;
    let container: IPersistenceContainer;

    beforeEach(() => {
        service = new PersistenceService();
        container = service.createContainer('namespace');
    });

    afterEach(() => {
        service = null;
        container = null;
    });

    it("Should persist value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');
    });

    it("Should persist in container and not in root", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('abc123')).toBeUndefined();
    });

    it("Should persist root with namespace", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('namespace::abc123')).toBe('TESTVAL');
    });

    it("Should not persist value on new object", () => {
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should remove persisted value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        container.remove('abc123');
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should remove info object when last item is removed", () => {
        container.set('abc123', 'TESTVAL');
        container.remove('abc123');
        expect(service.get('namespace')).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        container.set('abc123', undefined);
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should removeAll when instructed", () => {
        container.set('abc123', 'TESTVAL');
        container.set('def456', 'TESTVAL');
        container.removeAll();
        expect(container.get('abc123')).toBeUndefined();
        expect(container.get('def456')).toBeUndefined();
    });

    it("Should persist null value`", () => {
        container.set('abc123', null);
        expect(container.get('abc123')).toBeNull();
    });
    
    it("Should mutate object in storage", () => {
        container.set('abc123', {mutated: false});
        let obj = container.get('abc123');
        obj.mutated = true;
        expect(container.get('abc123')).toEqual({mutated: true});
    });

    it("Should be isolated from root scope", () => {
        container.set('abc123', "TESTVAL");
        service.set('abc123', "NEW_TESTVAL");
        expect(container.get('abc123')).toBe('TESTVAL');
    });
});

describe('Persistent Container Test: Memory - oneUse', () => {
    let service: PersistenceService;
    let container: IPersistenceContainer;

    beforeEach(() => {
        service = new PersistenceService();
        container = service.createContainer('namespace', {oneUse: true});
    });

    afterEach(() => {
        service = null;
        container = null;
    });

    it("Should return persisted value on first use", () => {
        container.set('abc123', 'TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');        
    });

    it("Should return undefined on second use", () => {
        container.set('abc123', 'TESTVAL');
        container.get('abc123');
        expect(container.get('abc123')).toBeUndefined();        
    });
});

describe('Persistent Container Test: Memory - expires', () => {
    let service: PersistenceService;
    let container: IPersistenceContainer;

    beforeEach(() => {
        service = new PersistenceService();
        container = service.createContainer('namespace', {expireAfter: 100});
    });

    afterEach(() => {
        service = null;
        container = null;
    });

    it("Should persist if expires has not been reached", () => {
        container.set('abc123', 'TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');
    });

    it("Should remove persisted value if expires has been reached", (done) => {
        container.set('abc123', 'TESTVAL');
        setTimeout ( () => {
            expect(container.get('abc123')).toBeUndefined();
            done();
        }, 150);
    });

    it("Should not persist if get is hit within expires multiple times", (done) => {
        container.set('abc123', 'TESTVAL');
        setTimeout ( () => {
            expect(container.get('abc123')).toBe('TESTVAL');
            setTimeout ( () => {
                expect(container.get('abc123')).toBeUndefined();
                done();
            }, 75);
        }, 75);
    });
});

describe('Persistent Container Test: Memory - timeout', () => {
    let service: PersistenceService;
    let container: IPersistenceContainer;

    beforeEach(() => {
        service = new PersistenceService();
        container = service.createContainer('namespace', {timeout: 100});
    });

    afterEach(() => {
        service = null;
        container = null;
    });

    it("Should persist if expires has not been reached", (done) => {
        container.set('abc123', 'TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');
        setTimeout( () => {
            expect(container.get('abc123')).toBe('TESTVAL');
            done();
        }, 75);
    });

    it("Should remove persisted value if expires has been reached", (done) => {
        container.set('abc123', 'TESTVAL');
        setTimeout ( () => {
            expect(container.get('abc123')).toBeUndefined();
            done();
        }, 150);
    });

    it("Should not persist if get is hit within expires multiple times", (done) => {
        container.set('abc123', 'TESTVAL');
        setTimeout ( () => {
            expect(container.get('abc123')).toBe('TESTVAL');
            setTimeout ( () => {
                expect(container.get('abc123')).toBe('TESTVAL');
                done();
            }, 75);
        }, 75);
    });
});

describe('Persistent Container Test: ImmutableMemory', () => {
    let service: PersistenceService;
    let container: IPersistenceContainer;

    beforeEach(() => {
        service = new PersistenceService();
        container = service.createContainer('namespace', {type: StorageType.IMMUTABLE_MEMORY});
    });

    afterEach(() => {
        service = null;
        container = null;
    });

    it("Should persist value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');
    });

    it("Should persist in container and not in root", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBeUndefined();
    });

    it("Should persist root with namespace", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('namespace::abc123', StorageType.IMMUTABLE_MEMORY)).toBe('TESTVAL');
    });

    it("Should not persist value on new object", () => {
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should remove persisted value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        container.remove('abc123');
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should remove info object when last item is removed", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('namespace', StorageType.IMMUTABLE_MEMORY)).toBeTruthy();
        container.remove('abc123');
        expect(service.get('namespace', StorageType.IMMUTABLE_MEMORY)).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        container.set('abc123', undefined);
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should removeAll when instructed", () => {
        container.set('abc123', 'TESTVAL');
        container.set('def456', 'TESTVAL');
        container.removeAll();
        expect(container.get('abc123')).toBeUndefined();
        expect(container.get('def456')).toBeUndefined();
    });

    it("Should persist null value`", () => {
        container.set('abc123', null);
        expect(container.get('abc123')).toBeNull();
    });
    
    it("Should not mutate object in storage", () => {
        container.set('abc123', {mutated: false});
        let obj = container.get('abc123');
        obj.mutated = true;
        expect(container.get('abc123')).toEqual({mutated: false});
    });

    it("Should be isolated from root scope", () => {
        container.set('abc123', "TESTVAL");
        service.set('abc123', "NEW_TESTVAL", {type: StorageType.IMMUTABLE_MEMORY});
        expect(container.get('abc123')).toBe('TESTVAL');
    });
});

describe('Persistent Container Test: Session', () => {
    let service: PersistenceService;
    let container: IPersistenceContainer;

    beforeAll(() => {
        sessionStorage.clear();
    });

    beforeEach(() => {
        service = new PersistenceService();
        container = service.createContainer('namespace', {type: StorageType.SESSION});
    });

    afterEach(() => {
        service = null;
        container = null;
    });

    it("Should persist value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');
    });

    it("Should persist in container and not in root", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('abc123', StorageType.SESSION)).toBeUndefined();
    });

    it("Should persist root with namespace", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('namespace::abc123', StorageType.SESSION)).toBe('TESTVAL');
    });

    it("Should persist value on new object", () => {
        expect(container.get('abc123')).toBe('TESTVAL');
    });

    it("Should remove persisted value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        container.remove('abc123');
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should remove info object when last item is removed", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('namespace', StorageType.SESSION)).toBeTruthy();
        container.remove('abc123');
        expect(service.get('namespace', StorageType.SESSION)).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        container.set('abc123', undefined);
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should removeAll when instructed", () => {
        container.set('abc123', 'TESTVAL');
        container.set('def456', 'TESTVAL');
        container.removeAll();
        expect(container.get('abc123')).toBeUndefined();
        expect(container.get('def456')).toBeUndefined();
    });

    it("Should persist null value`", () => {
        container.set('abc123', null);
        expect(container.get('abc123')).toBeNull();
    });
    
    it("Should not mutate object in storage", () => {
        container.set('abc123', {mutated: false});
        let obj = container.get('abc123');
        obj.mutated = true;
        expect(container.get('abc123')).toEqual({mutated: false});
    });

    it("Should be isolated from root scope", () => {
        container.set('abc123', "TESTVAL");
        service.set('abc123', "NEW_TESTVAL", {type: StorageType.SESSION});
        expect(container.get('abc123')).toBe('TESTVAL');
    });
});

describe('Persistent Container Test: Local', () => {
    let service: PersistenceService;
    let container: IPersistenceContainer;

    beforeAll(() => {
        localStorage.clear();
    });

    beforeEach(() => {
        service = new PersistenceService();
        container = service.createContainer('namespace', {type: StorageType.LOCAL});
    });

    afterEach(() => {
        service = null;
        container = null;
    });

    it("Should persist value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        expect(container.get('abc123')).toBe('TESTVAL');
    });

    it("Should persist in container and not in root", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('abc123', StorageType.LOCAL)).toBeUndefined();
    });

    it("Should persist root with namespace", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('namespace::abc123', StorageType.LOCAL)).toBe('TESTVAL');
    });

    it("Should persist value on new object", () => {
        expect(container.get('abc123')).toBe('TESTVAL');
    });

    it("Should remove persisted value in memory state", () => {
        container.set('abc123', 'TESTVAL');
        container.remove('abc123');
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should remove info object when last item is removed", () => {
        container.set('abc123', 'TESTVAL');
        expect(service.get('namespace', StorageType.LOCAL)).toBeTruthy();
        container.remove('abc123');
        expect(service.get('namespace', StorageType.LOCAL)).toBeUndefined();
    });

    it("Should remove persisted value when item is undefined`", () => {
        container.set('abc123', undefined);
        expect(container.get('abc123')).toBeUndefined();
    });

    it("Should removeAll when instructed", () => {
        container.set('abc123', 'TESTVAL');
        container.set('def456', 'TESTVAL');
        container.removeAll();
        expect(container.get('abc123')).toBeUndefined();
        expect(container.get('def456')).toBeUndefined();
    });

    it("Should persist null value`", () => {
        container.set('abc123', null);
        expect(container.get('abc123')).toBeNull();
    });
    
    it("Should not mutate object in storage", () => {
        container.set('abc123', {mutated: false});
        let obj = container.get('abc123');
        obj.mutated = true;
        expect(container.get('abc123')).toEqual({mutated: false});
    });

    it("Should be isolated from root scope", () => {
        container.set('abc123', "TESTVAL");
        service.set('abc123', "NEW_TESTVAL", {type: StorageType.LOCAL});
        expect(container.get('abc123')).toBe('TESTVAL');
    });
});
