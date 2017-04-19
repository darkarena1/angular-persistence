import { PersistenceService, StorageType, IPersistenceContainer } from '../..';

describe('PersistenceServiceTest: Memory', () => {
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
        expect(service.get('namespace:abc123')).toBe('TESTVAL');
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
});

// it("Should return persisted value on first use with oneUse flag set", () => {
//         service.set('abc123', 'TESTVAL', {oneUse: true});
//         expect(service.get('abc123')).toBe('TESTVAL');        
//     });

//     it("Should return undefined on second use with oneUse flag set", () => {
//         service.set('abc123', 'TESTVAL', {oneUse: true});
//         service.get('abc123');
//         expect(service.get('abc123')).toBeUndefined();        
//     });
