import { Observable } from 'rxjs/Observable';
import { PersistenceService, StorageType, ICache } from '../src/index';

describe('Persistent Cache Test: Memory', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => 'TESTVAL ' + number++);
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should get value when no value present", (done) => {
        cache.get().subscribe((val) => {
            expect(val).toBe('TESTVAL 0');
            done();
        });
    });

    it("Should used cached value if one has been retrieved", (done) => {
        cache.get().subscribe(() => {
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should not persist value if clear is run", (done) => {
        cache.get().subscribe(() => {
            cache.clear();
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });

    it("Value should not auto-load if accessed directly", () => {
        expect(service.get('abc123')).toBeUndefined();
    });

    it("Value should be available directly if already loaded", (done) => {
        cache.get().subscribe((val) => {
            expect(service.get('abc123')).toBe(val);
            done();
        });
    });

    it("Value is persisted across caches", (done) => {
        cache.get().subscribe(() => {
            let newCache = service.createCache('abc123', () => 'TESTVAL' + number++);
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Value is not persisted across  services", (done) => {
        cache.get().subscribe(() => {
            let newService = new PersistenceService();
            let newCache = newService.createCache('abc123', () => 'TESTVAL ' + number++);
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });
});

describe('Persistent Cache Test: IMMUTABLE_MEMORY', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => 'TESTVAL ' + number++, {type: StorageType.IMMUTABLE_MEMORY});
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should get value when no value present", (done) => {
        cache.get().subscribe((val) => {
            expect(val).toBe('TESTVAL 0');
            done();
        });
    });

    it("Should used cached value if one has been retrieved", (done) => {
        cache.get().subscribe(() => {
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should not persist value if clear is run", (done) => {
        cache.get().subscribe(() => {
            cache.clear();
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });

    it("Value should not auto-load if accessed directly", () => {
        expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBeUndefined();
    });

    it("Value should be available directly if already loaded", (done) => {
        cache.get().subscribe((val) => {
            expect(service.get('abc123', StorageType.IMMUTABLE_MEMORY)).toBe(val);
            done();
        });
    });

    it("Value is persisted across caches", (done) => {
        cache.get().subscribe(() => {
            let newCache = service.createCache('abc123', () => 'TESTVAL ' + number++, 
                {type: StorageType.IMMUTABLE_MEMORY});
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Value is not persisted across services", (done) => {
        cache.get().subscribe(() => {
            let newService = new PersistenceService();
            let newCache = newService.createCache('abc123', () => 'TESTVAL ' + number++, 
                {type: StorageType.IMMUTABLE_MEMORY});
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });

});

describe('Persistent Cache Test: SESSION', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => 'TESTVAL ' + number++, {type: StorageType.SESSION});
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should get value when no value present", (done) => {
        cache.get().subscribe((val) => {
            expect(val).toBe('TESTVAL 0');
            done();
        });
    });

    it("Should used cached value if one has been retrieved", (done) => {
        cache.get().subscribe(() => {
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should not persist value if clear is run", (done) => {
        cache.get().subscribe(() => {
            cache.clear();
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });

    it("Value should not auto-load if accessed directly", () => {
        expect(service.get('abc123', StorageType.SESSION)).toBeUndefined();
    });

    it("Value should be available directly if already loaded", (done) => {
        cache.get().subscribe((val) => {
            expect(service.get('abc123', StorageType.SESSION)).toBe(val);
            done();
        });
    });

    it("Value is persisted across caches", (done) => {
        cache.get().subscribe(() => {
            let newCache = service.createCache('abc123', () => 'TESTVAL ' + number++, 
                {type: StorageType.SESSION});
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Value is not persisted across services", (done) => {
        cache.get().subscribe(() => {
            let newService = new PersistenceService();
            let newCache = newService.createCache('abc123', () => 'TESTVAL ' + number++, 
                {type: StorageType.SESSION});
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });
});

describe('Persistent Cache Test: LOCAL', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => 'TESTVAL ' + number++, {type: StorageType.LOCAL});
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should get value when no value present", (done) => {
        cache.get().subscribe((val) => {
            expect(val).toBe('TESTVAL 0');
            done();
        });
    });

    it("Should used cached value if one has been retrieved", (done) => {
        cache.get().subscribe(() => {
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should not persist value if clear is run", (done) => {
        cache.get().subscribe(() => {
            cache.clear();
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });

    it("Value should not auto-load if accessed directly", () => {
        expect(service.get('abc123', StorageType.LOCAL)).toBeUndefined();
    });

    it("Value should be available directly if already loaded", (done) => {
        cache.get().subscribe((val) => {
            expect(service.get('abc123', StorageType.LOCAL)).toBe(val);
            done();
        });
    });

    it("Value is persisted across caches", (done) => {
        cache.get().subscribe(() => {
            let newCache = service.createCache('abc123', () => 'TESTVAL ' + number++, 
                {type: StorageType.LOCAL});
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Value is not persisted across services", (done) => {
        cache.get().subscribe(() => {
            let newService = new PersistenceService();
            let newCache = newService.createCache('abc123', () => 'TESTVAL ' + number++, 
                {type: StorageType.LOCAL});
            newCache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });
});

describe('Persistent Cache Test: Memory - expires', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => 'TESTVAL ' + number++, {expireAfter: 100});
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should persist if expires has not been reached", (done) => {
        cache.get().subscribe((val1) => {
            expect(val1).toBe('TESTVAL 0');
            cache.get().subscribe((val2) => {
                expect(val2).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should remove persisted value if expires has been reached", (done) => {
        cache.get().subscribe((val1) => {
            expect(val1).toBe('TESTVAL 0');
            setTimeout( () => {
                cache.get().subscribe((val2) => {
                    expect(val2).toBe('TESTVAL 1');
                    done();
                });
            }, 150 );        
        });
    });

    it("Should not persist if get is hit within expires multiple times", (done) => {
        cache.get().subscribe((val1) => {
            expect(val1).toBe('TESTVAL 0');
            setTimeout( () =>
                cache.get().subscribe((val2) => {
                    expect(val2).toBe('TESTVAL 0');
                    setTimeout( () =>
                        cache.get().subscribe((val3) => {
                            expect(val3).toBe('TESTVAL 1');
                            done();
                        }), 75
                    );
                }), 75
            );
        });        
    });
});

describe('Persistent Cache Test: Memory - timeout', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => 'TESTVAL ' + number++, {timeout: 100});
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should persist if timeout has not been reached", (done) => {
        cache.get().subscribe((val1) => {
            expect(val1).toBe('TESTVAL 0');
            cache.get().subscribe((val2) => {
                expect(val2).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should remove persisted value if timeout has been reached", (done) => {
        cache.get().subscribe((val1) => {
            expect(val1).toBe('TESTVAL 0');
            setTimeout( () =>
                cache.get().subscribe((val2) => {
                    expect(val2).toBe('TESTVAL 1');
                    done();
                }), 150
            );
        });        
    });

    it("Should persist if get is hit within timeout multiple times", (done) => {
        cache.get().subscribe((val1) => {
            expect(val1).toBe('TESTVAL 0');
            setTimeout( () =>
                cache.get().subscribe((val2) => {
                    expect(val2).toBe('TESTVAL 0');
                    setTimeout( () =>
                        cache.get().subscribe((val3) => {
                            expect(val3).toBe('TESTVAL 0');
                            done();
                        }), 75
                    );
                }), 75
            );
        });        
    });
});

describe('Persistent Cache Test: Memory - short observable', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => Observable.of('TESTVAL ' + number++));
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should get value when no value present", (done) => {
        cache.get().subscribe((val) => {
            expect(val).toBe('TESTVAL 0');
            done();
        });
    });

    it("Should used cached value if one has been retrieved", (done) => {
        cache.get().subscribe(() => {
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should not persist value if clear is run", (done) => {
        cache.get().subscribe(() => {
            cache.clear();
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });

    it("Value should not auto-load if accessed directly", () => {
        expect(service.get('abc123')).toBeUndefined();
    });

    it("Value should be available directly if already loaded", (done) => {
        cache.get().subscribe((val) => {
            expect(service.get('abc123')).toBe(val);
            done();
        });
    });
});

describe('Persistent Cache Test: Memory - long observable', () => {
    let service: PersistenceService;
    let cache: ICache<string>;
    let number: number;
    
    beforeEach(() => {
        number = 0;
        service = new PersistenceService();
        cache = service.createCache('abc123', () => Observable.of('TESTVAL ' + number++).timeout(100));
    });

    afterEach(() => {
        cache.clear();
        service = null;
        cache = null;
    });

    it("Should get value when no value present", (done) => {
        cache.get().subscribe((val) => {
            expect(val).toBe('TESTVAL 0');
            done();
        });
    });

    it("Should used cached value if one has been retrieved", (done) => {
        cache.get().subscribe(() => {
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 0');
                done();
            });
        });
    });

    it("Should not persist value if clear is run", (done) => {
        cache.get().subscribe(() => {
            cache.clear();
            cache.get().subscribe((val) => {
                expect(val).toBe('TESTVAL 1');
                done();
            });
        });
    });

    it("Value should not auto-load if accessed directly", () => {
        expect(service.get('abc123')).toBeUndefined();
    });

    it("Value should be available directly if already loaded", (done) => {
        cache.get().subscribe((val) => {
            expect(service.get('abc123')).toBe(val);
            done();
        });
    });
});
