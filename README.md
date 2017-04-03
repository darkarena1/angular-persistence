# angular-persistence
>Library to aid in a consistent implementation of browser storage including memory, session, and local storage.

This project allows you to persist data within an **Angular 2** or **Angular 4** application written in _TypeScript_, _ES6_ or _ES5_.  The implementations of the various storage techniques have been expanded and normalized such that no specific knowledge should be needed of the various storage types and thier uses.  In addition, the library will help with cleanup of persistent cached data by keeping track of which data has been loaded and where it is put.

## Contents
* Basic Usage
* Storage Types
* Setter Configuration
* Proxies and Property Bindings
* Observable Cache
* Change Listeners
* Contributions

## Basic Usage

To use this library, install it via npm into your project.  

```Shell
npm install angular-persistence --save 
```

Next install the Persistence Module into your module:
```Typescript
import { PersistenceModule } from 'angular-persistence';

@ngModule System.config({
    import: [PersistenceModule]
});
```

Once imported, the Module can be used from within your components or other Injectables:

```Typescript
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

// clears all storage saved by this service, and 
// returns list of keys
persistenceService.removeAll();             

//cleans the storage of expired objects
persistenceService.clean();
```

There are more options for each of these methods.  For complete usage, please see the API documentation.

## Storage Types

This library is capable of handling various storage types within the browser.  These are specified on get, remove, removeall, and clean methods via the type parameter.  For set and cache the type is specified on the config object.  The _StorageType_ enumeration contains the list of available storage types.  If not storage type is specified, Memory storage type is used.  Currently the framework supports:

- **MEMORY**: the fastest and most flexible memory type.  This will simply store the object within the service instance's memory.  This storage type WILL NOT persist among page re-loads and objects inside of
this collection, if mutated, will mutate all instances of the object.  As such, this works best with immutable objects and can accomodate large data sets as well as objects that have some actual
logic.

- **IMMUTABLE_MEMORY**: this storage type is just like the memory storage type EXCEPT that the objects are serialized before they are saved and then deserialized on a get.  This is the same as browser and local storage, only the data is not persisted beyond the service instance.  Just like local and session storage, however, this storage type is incapable of serializing objects that are not
serializable with the Javascript JSON class.

- **SESSION**: this storage type is persistent so long as the current browser tab is being displayed.  Different tabs will have different values.  Even if the page is refreshed or the service instance is restarted, this storage type will persist for the current tab.  This storage type is incapable of serializing objects that are not serializable via Javascripts JSON class.  Also, unlike session storage provided by javascript, this SessionStorage *CAN* distinguish between a null value and undefined.

- **LOCAL**: this storage type is persistent permanently.  If used too extensively, this can clog up your browser.  It is suggested hat you specify a "maxAge" for objects on the local storage.  Otherwise this works just like Session storage with the same limintations.

```typescript
persistenceService.set('myName', 'scott', {type: StorageType.SESSION});  
persistenceService.get('myName', StorageType.SESSION);
persistenceService.remove('myName', StorageType.SESSION);
persistenceService.removeAll(StorageType.SESSION);
persistenceService.clean(StorageType.SESSION);
```

## Setter Configuration

The config is specified for both the _cache_ and the _set_ methods of the persistence framework and it determines how the objects are to be cached and for how long.  In the previous section we introduced  you to the 'type' property of the config.  Now we'll delve into some of the others:

- **timeout** - specifies a value (in ms) for when the value in the property becomes 'stale'.  Every time the value is accessed via the 'get' or 'cache' method, the timeout counter is restarted.
- **expireAfter** - specifies after how much time (in ms) the stored value will be valid for after it has been set.  Unlike the timeout, this value will not reset when the value is read, only when a new value is set.
- **oneUse** - this specifies that the property will only be valid for a single read.  This is great for short term storage.

```typescript
persistenceService.set('myName', 'scott', {type: StorageType.SESSION, oneUse: true});
```

## Proxies and Property Bindings

This framework supports a lot of options, and as such it may be hard to use consistently with the normal getters and setters.  As such, the preferred way for using this service is through a proxy which has a greatly simplified API that enforces consistency of your desired options and greatly simplifies the frameworks usage.  By creating a proxy, you do not need to specify the key or any configuration data.

```typescript
@Injectable()
class Foo {
    private myNameProxy;

    constructor (persistenceService: PersistenceService) {
        this.myNameProxy = persistenceService.createProxy<string>(
            'myName', 
            {type: StorageType.SESSION, oneUse: true}
        );
    }

    accessData() {
        // sets the myName attribute on session
        this.myNameProxy.set('scott');

        // gets the myName attribute
        this.myNameProxy.get();

        // returns undefined because oneUse is set
        this.myNameProxy.get();

        // removes myName attribute if we have one
        this.remove();
    }
}
```

Finally, it is possible to create a bound property on your object that would make things even easier.  If doing this, however, it may not be entirely clear that you are interacting with a bound property and things like doing a delete would erase the property values.  There are some enhancements in ES6 which may eventually allow us to make this a bit cooler.  As such, I tend to prefer the proxys, but you can use the option below if you want to make your code uber concise.

```typescript
@Injectable()
class Foo {
    constructor (persistenceService: PersistenceService) {
        public myName: string;

        persistenceService.defineBoundProperty<string>(
            this,
            'myName',
            'property_', 
            {type: StorageType.SESSION, oneUse: true}
        );
    }

    accessData() {
        // sets the property_myName attribute on session
        this.myName = 'scott';

        // gets the property_myName attribute (return 'scott')
        this.myName;

        // returns undefined because oneUse is set
        this.myName;
    }
}
```
Technically you don't need to define the property ahead of time but typescript likes to have it there and it allows for code completion.  Defining a bound property will replace any existing property.

Pretty cool, right?

## Observable Cache

Much of AngularJS uses ReactiveX design using Observables.  Services and components may wish to cache values returned from an AJAX call and return the cached data rather then waiting for live data.  As such, the Persistence framework supports an Rx command for caching.  Using this method, your service or component can access a cached version if it is available or it can load from the server if it is not.

```typescript
persistenceService.cache(
    'myName', 
    () => new myUserObservable(), 
    {type: StorageType.SESSION, timeout: 1000 * 60 * 60}
).subscribe (...);
```

To load the cache, we can also allow our loader to return a static value, in this case the observable will load 5 into the cache immedietly and then work off the cached value.  This makes Rx with caching easy whether you want to provide an observable (like from the angular http service) or whether you want to load an initial value from a function synchronously and then move into an Rx design.

```typescript
let subscription = persistenceService.cache(
    'myName', 
    () => 5, 
    {type: StorageType.SESSION, timeout: 1000 * 60 * 60}
).subscribe (...);
```
Additionally, the caching framework has its own proxy object which can be used to simplify getting a reloadable value from the cache.

```typescript
let proxy =  persistenceService.createCacheProxy(
    'myName', 
    () => new myUserObservable(), 
    {type: StorageType.SESSION, timeout: 1000 * 60 * 60}
);

proxy.get().subscribe(...);
```

Because this takes advantage of Rx design, there is no reason to provide a property binder like we have available with the other proxy.  As such there is not one provided through the service.

The reason I added this API was because I wanted to be able to cache user information for a period of time and have it work across applications.  By using the cache and binding my http observable to the cache value using SESSION storage, I can use the same object when navigating from one application to the other.

## Change Listeners

There is also a way to observe attribute changes within the service.  The service has an EventEmitter.

```typescript
let subscription = persistenceService.changes.subscribe((value) => {
    console.log 'Value changed: ' + value.key + ' in sotrage number ' + value.type
});
```

This will run the script for every change to every property in every storage type.  To limit the notifier to a single value in a single storage type, we can do the following:

```typescript
persistenceService.propertyChanges('myName', StorageType.SESSION)
    .subscribe((value)=> { console.log('my value changed')});
```
This would log something only when the myName property in session storage changed.

**_NOTE:_ these are hot multi-value Obserables per the Rx specification that return values over time.  It is important to remove your subscription from these observables when you no longer need them or a memory leak might occur.**

## Contributors:
- Scott O'Bryan

## License
MIT
