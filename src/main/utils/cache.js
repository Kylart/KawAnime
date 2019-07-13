export default class {
  constructor () {
    this.map = new Map()
    this.defaultTtl = 5 * 60 * 1000
  }

  set (key, value, ttl = this.defaultTtl) {
    this.map.set(key, {
      value,
      expireAt: (new Date()).getTime() + ttl,
      timeout: setTimeout(() => {
        this.clear(key)
      }, ttl)
    })
  }

  clear (key) {
    this.map.delete(key)
  }

  has (key) {
    return this.map.has(key)
  }

  get (key) {
    return this.has(key) && this.map.get(key).value
  }
}
