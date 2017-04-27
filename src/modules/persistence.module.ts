import { NgModule }           from '@angular/core';
import { PersistenceService } from '../services/persistence.service';

/**
 * The module for the persistence framework.  This will register the PersistenceService
 * as a provider and export it.
 * 
 * @export
 * @class AngularPersistenceModule
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
@NgModule({
    exports: [PersistenceService],
    imports: [],
    providers: [PersistenceService],
})
export class PersistenceModule { }
