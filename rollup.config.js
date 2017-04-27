export default {
    entry: './dist/index.js',
    dest: './dist/bundles/angular-persistence.umd.js',
    format: 'umd',
    // Global namespace.
    moduleName: 'angular.persistence',
    // External libraries.
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/router',
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/ConnectableObservable',
        'rxjs/Subscriber', 
        'rxjs/Subject'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/router': 'ng.router',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx',
        'rxjs/ConnectableObservable': 'Rx',
        'rxjs/Subscriber': 'Rx', 
        'rxjs/Subject': 'Rx'
    },
    onwarn: () => { return }
}