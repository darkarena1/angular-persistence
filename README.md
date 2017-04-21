# angular-persistence
>Library to aid in a consistent implementation of browser storage including memory, session, and local storage.

This project allows you to persist data within an **Angular 2** or **Angular 4** application written in _TypeScript_, _ES6_ or _ES5_.  The implementations of the various storage techniques have been expanded and normalized such that no specific knowledge should be needed of the various storage types and thier uses.  In addition, the library will help with cleanup of persistent cached data by keeping track of which data has been loaded and where it is put.

[![npm version](https://badge.fury.io/js/angular-persistence.svg)](https://badge.fury.io/js/angular-persistence)
[![Build Status](https://travis-ci.org/darkarena1/angular-persistence.svg?branch=master)](https://travis-ci.org/darkarena1/angular-persistence)
[![Dependencies](https://david-dm.org/darkarena1/angular-persistence/status.svg)](https://david-dm.org/darkarena1/angular-persistence)
[![PeerDependencies](https://david-dm.org/darkarena1/angular-persistence/peer-status.svg)](https://david-dm.org/darkarena1/angular-persistence?type=peer)

## Contents
* [1 Basic Usage](#1)
* [2 Storage Types](#2)
* [3 Storage Configuration](#3)
* [4 Isolated Containers](#4)
* [5 Property Bindings](#5)
* [6 Observable Caches](#6)
* [7 Change Observables](#7)
* [8 Contributors](#8)
* [9 Acknowledgements](#9)
* [10 License](#10)

## <a name="1"></a>1 Basic Usage

To use this library, install it via npm into your project.  

```shell
npm install angular-persistence --save 
```

Next install the Persistence Module into your module:
```typescript
import { PersistenceModule } from 'angular-persistence';

@ngModule System.config({
    import: [PersistenceModule]
});
```

Once imported, the Module can be used from within your components or other injectables:

```typescript
import { PersistenceService } from 'angular-persistence';

class Foo {
    constructor(private persistenceService: PersistenceService) {}
}
```

To access persisted properties, use the following:

```typescript
// will return true if successful
persistenceService.set('myName', 'scott');

// returns scott
persistenceService.get('myName');

// returns previous value (scott) and removes
persistenceService.remove('myName');

// clears all storage saved by this service, and returns a list 
// of keys that were removed
persistenceService.removeAll();    

//cleans the storage of expired objects
persistenceService.clean();
```

There are more options for each of these methods.  For complete usage, please see the API documentation.

## <a name="2"></a>2 Storage Types

This library is capable of handling various storage types within the browser.  These are specified on get, remove, removeall, and clean methods via the type parameter.  For other methods like set and createCache, the type is specified on the config object.  The _StorageType_ enumeration contains the list of available storage types.  If not storage type is specified, _MEMORY_ storage type is used.  Currently the framework supports:

- **MEMORY**: the fastest and most flexible memory type.  This will simply store the object within the service instance's memory.  This storage type WILL NOT persist among page re-loads and objects inside of this collection, if mutated, will mutate all instances of the object.  As such, this works best with immutable objects and can accomodate large data sets as well as objects that have some actual logic.

- **IMMUTABLE_MEMORY**: this storage type is just like the memory storage type EXCEPT that the objects are serialized before they are saved and then deserialized on a get.  This is the same as browser and local storage, only the data is not persisted beyond the service instance.  Just like local and session storage, however, this storage type is incapable of serializing objects that are not serializable with the Javascript JSON class.

- **SESSION**: this storage type is persistent so long as the current browser tab is being displayed.  Different tabs will have different values.  Even if the page is refreshed or the service instance is restarted, this storage type will persist for the current tab.  This storage type is incapable of serializing objects that are not serializable via Javascripts JSON class.  Also, unlike session storage provided by javascript, this SessionStorage *CAN* distinguish between a null value and undefined.

- **LOCAL**: this storage type is persistent permanently.  If used too extensively, this can clog up your browser.  It is suggested hat you specify a "maxAge" for objects on the local storage.  Otherwise this works just like Session storage with the same limintations.

```typescript
persistenceService.set('myName', 'scott', {type: StorageType.SESSION});  
persistenceService.get('myName', StorageType.SESSION);
persistenceService.remove('myName', StorageType.SESSION);
persistenceService.removeAll(StorageType.SESSION);
persistenceService.clean(StorageType.SESSION);
```

## <a name="3"></a>3 Storage Configuration

Config objects are used for several methods within the persistence framework to provide additional configuration.  Depending on the option, some or all of the following configuration types are available.  In addition to storage type, the config options let the framework know when to expire items from the cache..  In the previous section we introduced you to the 'type' property of the config.  Now we'll delve into some of the others:

- **timeout** - specifies a value (in ms) for when the value in the property becomes 'stale'.  Every time the value is accessed via the 'get' or 'cache' method, the timeout counter is restarted.
- **expireAfter** - specifies after how much time (in ms) the stored value will be valid for after it has been set.  Unlike the timeout, this value will not reset when the value is read, only when a new value is set.
- **oneUse** - this option is not available for all configurable methods.  Some methods (like createCache) can't support the oneUse option because of thier nature.  This option is great for short term storage.

```typescript
persistenceService.set('myName', 'scott', {type: StorageType.SESSION, oneUse: true});
```

## <a name="4"></a>4 Isolated Containers

Isolated Persistence Containers serve two needs throughout the system.  First off, they provide a much simpler interface then calling the service methods directly, especially when configuration options or non-MEMORY storage types are used because the configuration is specified when the container is created.  This allows you to create a container that will store a value in a certain way, and all getters and setters will use the same configuration when loading and saving attributes.

Secondly, it provides an isolated grouping of objects that are stored in a namespace.  So two different libraries that might use the persistence library, have less chance of attributes conflicting.  Additionally, I had a usecase where route components had separate data, but this data needed to be removed at the same time even though neither component was aware of the others properties.  By using a container, both components shared a namespace and when I needed to delete the persisted values from both, I simply did a removeAll from the container and voila, all of the attributes were gone.

Using a Persistence container is the preferred way to interact with this service and you are strongly encourages to create PersistenceContainers for anything that may require persisted values.

```typescript
@Injectable()
class Foo {
    private container: IPersistenceContainer;

    constructor (persistenceService: PersistenceService) {
        this.container = persistenceService.createContainer<string>(
            'org.myApplication.namespace',
            {type: StorageType.SESSION, oneUse: true}
        );
    }

    accessData() {
        // sets the myName attribute on session
        this.myNameProxy.set('myName','scott');

        // gets the myName attribute
        this.myNameProxy.get('myName');

        // returns undefined because oneUse is set
        this.myNameProxy.get('myName');

        // removes myName attribute if we have one
        this.remove('myName');

        // nukes the container and storage from orbit
        this.removeAll();
    }
}
```

## <a name="5"></a>5 Property Bindings

There are times when you only want a single attribute to be accessible to your component.  This library supports the creation of bound properties.

```typescript
@Injectable()
class Foo {
    // Technically this is not needed, but it makes typescript happy.
    myName: string;

    constructor (persistenceService: PersistenceService) {
        persistenceService.defineProperty(this, 'myName', 'myNameProperty', 
            {type: StorageType.SESSION, oneUse: true});
        )
    }

    accessData() {
        // sets the property_myName attribute on session
        this.myName = 'scott';

        // gets the property_myName attribute (return 'scott')
        this.myName;

        // returns undefined because oneUse is set
        this.myName;

        // same as doing a delete on the property.  IF not already
        // undefined, this would remove the property from storage
        this.myName = undefined;
    }
}
```
One word of warning, it's not always clear what properties are bound and which are not because they seem to be used like regular javascript properties.  Please understand the implications of this before using it and see the documentation on Object.defineProperty in the javascript specifications before using.  

Now that the warnings have been put asside, this is pretty cool, right?

## <a name="6"></a>6 Observable Caches

Much of AngularJS uses ReactiveX design using Observables.  Services and components may wish to cache values returned from an AJAX call and return the cached data rather then waiting for live data, and if the cached value should expire or become unavailable then we would want to have the values loaded once again.  As such, the persistence framework supports creating a cache.

```typescript
persistenceService.createCache(
    'myName', 
    (key) => Observable.of('Scott O\'Bryan'), 
    {type: StorageType.SESSION, timeout: 3600000} //one hour
).subscribe (...);
```

CreateCache returns an Observable which will return a single value.  If there is a cached value that has been accessed (in this example) within the last hour, it will always return a value from the cache.  If, however, the cache has expired, it will retrieve the value from the loader function whcih returns an observable of its own.

The observable returned from the cache is guarenteed to have a single value.  If the observable returned from the loader has more then one value, the persistence framework will wait intil the last view is recieved before setting the value on the cache.

## <a name="6"></a>7 Change Observable

If you wanted to observe all changes to the attributes on the persistence framework, you could use the following:

```typescript
let subscription = persistenceService.changes().subscribe((key, storageType) => {
    console.log( key + ' was changed on sotrage number '+storageType));
}
```

This will return all changes and can be fairly chatty, so if you wanted to listen to changes for a particular property, you could supply a key and/or storage type to listen to.

```typescript
let subscription = persistenceService.changes({key: 'myProp', type: StorageType.SESSION}).subscribe( (key, storageType)=> {
    console.log('myProp was changed on the session');
}
```

**_NOTE:_ these are hot multi-value Obserables per the Rx specification that return values over time.  It is important to remove your subscription from these observables when you no longer need them or a memory leak might occur.**

## <a name="8"></a>8 Contributors:
- Scott O'Bryan

## <a name="9"></a>9 Acknowledgements:
Special thanks to Roberto Simonetti for his angular-library-starter (https://github.com/robisim74/angular-library-starter).  Saved me a bunch of time. 

## <a name="10"></a>10 License
MIT
