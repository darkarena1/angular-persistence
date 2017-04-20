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
        'rxjs/Observable',
        'rxjs/Observer',
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx',
    },
    onwarn: () => { return }
}