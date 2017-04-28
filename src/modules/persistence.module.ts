import { NgModule }           from '@angular/core';
import { PersistenceService } from '../angular-persistence';

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
    providers: [PersistenceService]
})
export class PersistenceModule { }
