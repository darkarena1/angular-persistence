import { Storable } from "./persistence.storable";

/**
 * A type defining information needed to access an item.
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export type ItemDefinition = Storable &  {
    key?: string;
};
