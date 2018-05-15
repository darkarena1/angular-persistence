import { IStorage } from "../src/services/storage/storage.interface";
import { MemoryStorage } from "../src/services/storage/storage.memory";
import { ImmutableMemoryStorage } from "../src/services/storage/storage.immutable_memory";
import { SessionStorage } from "../src/services/storage/storage.session";
import { LocalStorage } from "../src/services/storage/storage.local";


describe('MemoryStorage', () => {
    let storage: IStorage;

    beforeEach(() => {
        storage = new MemoryStorage();
    });

    afterEach(() => {
        storage = null;
    });

    it("Should be available", () => {
        expect(storage.available()).toBeTruthy();
    });

    it("Should persist value in memory state", () => {
        storage.set('abc123', 'TESTVAL');
        expect(storage.get('abc123')).toBe('TESTVAL');
    });

    it("Should not persist beyond lifecycle of object", () => {
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should remove persisted value", () => {
        storage.set('abc123', 'TESTVAL');
        storage.remove('abc123');
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should be able to distinguish between null and undefined", () => {
        storage.set('abc123', null);
        expect(storage.get('abc123')).toBeNull();

        storage.set('abc123', undefined);
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should return accurate list of keys", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.keys()).toContain('abc123');
        expect(storage.keys()).toContain('def456');
        storage.remove('abc123');
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).toContain('def456');
        storage.set('def456', undefined);
        expect(storage.keys()).not.toContain('def456');
    });

    it("Should return correct value for exists", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.exists('abc123')).toBeTruthy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.remove('abc123');
        expect(storage.exists('abc123')).toBeFalsy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.set('def456', undefined);
        expect(storage.exists('def456')).toBeFalsy();        
    });

    it("Should remove all items in storage", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        
        storage.removeAll();
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).not.toContain('def456');
    });


    it("Should mutate object in storage", () => {
        storage.set('abc123', {mutated: false});
        let obj = storage.get('abc123');
        obj.mutated = true;
        expect(storage.get('abc123')).toEqual({mutated: true});
    });
});

describe('ImmutableMemoryStorage', () => {
    let storage: IStorage;

    beforeEach(() => {
        storage = new ImmutableMemoryStorage();
    });

    afterEach(() => {
        storage = null;
    });

    it("Should be available", () => {
        expect(storage.available()).toBeTruthy();
    });

    it("Should persist value", () => {
        storage.set('abc123', 'TESTVAL');
        expect(storage.get('abc123')).toBe('TESTVAL');
    });

    it("Should not persist beyond lifecycle of object", () => {
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should remove persisted value ", () => {
        storage.set('abc123', 'TESTVAL');
        storage.remove('abc123');
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should be able to distinguish between null and undefined", () => {
        storage.set('abc123', null);
        expect(storage.get('abc123')).toBeNull();

        storage.set('abc123', undefined);
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should return accurate list of keys", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.keys()).toContain('abc123');
        expect(storage.keys()).toContain('def456');
        storage.remove('abc123');
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).toContain('def456');
        storage.set('def456', undefined);
        expect(storage.keys()).not.toContain('def456');
    });

    it("Should return correct value for exists", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.exists('abc123')).toBeTruthy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.remove('abc123');
        expect(storage.exists('abc123')).toBeFalsy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.set('def456', undefined);
        expect(storage.exists('def456')).toBeFalsy();        
    });

    it("Should remove all items in storage", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        
        storage.removeAll();
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).not.toContain('def456');
    });

    it("Should not mutate object in storage", () => {
        storage.set('abc123', {mutated: false});
        let obj = storage.get('abc123');
        obj.mutated = true;
        expect(storage.get('abc123')).toEqual({mutated: false});
    });
});

describe('SessionStorage', () => {
    let storage: IStorage;

    beforeAll(() => {
        sessionStorage.clear();
    });

    beforeEach(() => {
        storage = new SessionStorage();
    });

    afterEach(() => {
        storage = null;
    });

    it("Should be available", () => {
        expect(storage.available()).toBeTruthy();
    });

    it("Should persist value", () => {
        storage.set('abc123', 'TESTVAL');
        expect(storage.get('abc123')).toBe('TESTVAL');
    });

    it("Should persist beyond lifecycle of object", () => {
        expect(storage.get('abc123')).toBe('TESTVAL');
    });

    it("Should remove persisted value", () => {
        storage.set('abc123', 'TESTVAL');
        storage.remove('abc123');
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should be able to distinguish between null and undefined", () => {
        storage.set('abc123', null);
        expect(storage.get('abc123')).toBeNull();

        storage.set('abc123', undefined);
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should return accurate list of keys", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.keys()).toContain('abc123');
        expect(storage.keys()).toContain('def456');
        storage.remove('abc123');
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).toContain('def456');
        // storage.set('def456', undefined);
        // expect(storage.keys()).not.toContain('def456');
    });

    it("Should return correct value for exists", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.exists('abc123')).toBeTruthy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.remove('abc123');
        expect(storage.exists('abc123')).toBeFalsy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.set('def456', undefined);
        expect(storage.exists('def456')).toBeFalsy();        
    });

    it("Should remove all items in storage", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        
        storage.removeAll();
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).not.toContain('def456');
    });

    it("Should not mutate object in storage", () => {
        storage.set('abc123', {mutated: false});
        let obj = storage.get('abc123');
        obj.mutated = true;
        expect(storage.get('abc123')).toEqual({mutated: false});
        storage.removeAll();
    });
});

describe('LocalStorage', () => {
    let storage: IStorage;

    beforeAll(() => {
        localStorage.clear();
    });

    beforeEach(() => {
        storage = new LocalStorage();
    });

    afterEach(() => {
        storage = null;
    });

    it("Should be available", () => {
        expect(storage.available()).toBeTruthy();
    });

    it("Should persist value", () => {
        storage.set('abc123', 'TESTVAL');
        expect(storage.get('abc123')).toBe('TESTVAL');
    });

    it("Should persist beyond lifecycle of object", () => {
        expect(storage.get('abc123')).toBe('TESTVAL');
    });

    it("Should remove persisted value", () => {
        storage.set('abc123', 'TESTVAL');
        storage.remove('abc123');
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should be able to distinguish between null and undefined", () => {
        storage.set('abc123', null);
        expect(storage.get('abc123')).toBeNull();

        storage.set('abc123', undefined);
        expect(storage.get('abc123')).toBeUndefined();
    });

    it("Should return accurate list of keys", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.keys()).toContain('abc123');
        expect(storage.keys()).toContain('def456');
        storage.remove('abc123');
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).toContain('def456');
        storage.set('def456', undefined);
        expect(storage.keys()).not.toContain('def456');
    });

    it("Should return correct value for exists", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        expect(storage.exists('abc123')).toBeTruthy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.remove('abc123');
        expect(storage.exists('abc123')).toBeFalsy();
        expect(storage.exists('def456')).toBeTruthy();
        storage.set('def456', undefined);
        expect(storage.exists('def456')).toBeFalsy();        
    });

    it("Should remove all items in storage", () => {
        storage.set('abc123', 'TESTVAL');
        storage.set('def456', 'TESTVAL');
        
        storage.removeAll();
        expect(storage.keys()).not.toContain('abc123');
        expect(storage.keys()).not.toContain('def456');
    });

    it("Should not mutate object in storage", () => {
        storage.set('abc123', {mutated: false});
        let obj = storage.get('abc123');
        obj.mutated = true;
        expect(storage.get('abc123')).toEqual({mutated: false});
        storage.removeAll();
    });
});
