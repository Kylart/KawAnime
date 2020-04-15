export default class {
  /**
   * Offers default caching possibilities.
   *
   * This will cache anything for 5 minutes.
   */
  constructor () {
    this.map = new Map()
    this.defaultTtl = 5 * 60 * 1000
  }

  /**
   * Insert a value in the cache.
   *
   * @param {Any} key Key to use. Can be anything.
   * @param {Any} value Value to cache
   * @param {Number} [ttl = 5 * 60 * 1000] Timeout for this item
   *
   * @returns {undefined}
   */
  set (key, value, ttl = this.defaultTtl) {
    this.map.set(key, {
      value,
      expireAt: (new Date()).getTime() + ttl,
      timeout: setTimeout(() => {
        this.clear(key)
      }, ttl)
    })
  }

  /**
   * Delete the value with the given key.
   *
   * @param {Any} key
   * @returns {undefined}
   */
  clear (key) {
    this.map.delete(key)
  }

  /**
   * Returns whether a given key has stored value.
   *
   * @param {Any} key
   * @returns {Boolean}
   */
  has (key) {
    return this.map.has(key)
  }

  /**
   * Returns the value associated to the given key.
   *
   * @param {Any} key
   * @returns {Any}
   */
  get (key) {
    return this.has(key) && this.map.get(key).value
  }
}
