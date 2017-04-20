/**
 * An interface which specified supported terms of persistence expiration
 * throughout the framework.
 * 
 * @author Scott O'Bryan
 * @since 1.0
 */
export type Expirable = {
    /**
     * Specified a value (in ms) for when the value in the cache
     * becomes 'stale'.  Every time the value is accessed via the
     * 'getter', the timeout counter is restarted.
     * 
     * @type {number}
     */
    timeout?: number;

    /**
     * Specifies after how much time (in ms) the stored value will be 
     * valid for.  Unlike the timeout, this value will not reset when 
     * the value is read.
     * 
     * @type {number}
     */
    expireAfter?: number;
};