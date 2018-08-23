// 初始化全局变量

const win = window
win.externStorage = typeof win.externStorage === 'undefined' ? {} : win.externStorage

class CacheFacade {
  static store(strategy) {
    return new CacheFacade(strategy)
  }

  constructor(strategy = 'externStorage') {
    this._checkStategy(strategy)
    this.strategy = strategy
  }

  _checkStategy(strategy) {
    const supportStrategies = ['externStorage', 'localStorage', 'sessionStorage']

    if (!supportStrategies.includes(strategy)) {
      throw new ReferenceError(`${strategy} storage is not support`)
    }
  }

  /**
   * @param {string} key
   * @param {any} val
   * @param {number} maxAge 存储时间：ms
   */
  put(key, val, maxAge = 0) {
    const data = {
      val,
      expires: maxAge === 0 ? 0 : Date.now() + maxAge,
    }
    win[this.strategy][key.toString()] = JSON.stringify(data)
  }

  has(key) {
    return this.get(key) !== null
  }

  /**
   * 覆盖 value的值，但是不更新过期时间
   */
  cover(key, value) {
    const data = win[this.strategy][key.toString()] &&
      JSON.parse(win[this.strategy][key.toString()])

    if (data) {
      data.val = value
      win[this.strategy][key.toString()] = JSON.stringify(data)
    }
  }

  /**
   * 只存储没有的数据
   *
   * @return bool 如果存放成功返回 true ，否则返回 false
   */
  add(key, val, maxAge = 0) {
    if (this.get(key) === null) {
      this.put(key, val, maxAge)
      return true
    }

    return false
  }

  get(key, defaultValue) {
    const data = win[this.strategy][key.toString()] &&
      JSON.parse(win[this.strategy][key.toString()])

    if (data) {
      // expires 视为永久存储
      if (data.expires === 0) {
        return data.val
      }

      // 在有效期内
      if (Date.now() < data.expires) {
        return data.val
      }

      // 已过期
      this.forget(key)

      return defaultValue ? defaultValue : null
    }

    return defaultValue ? defaultValue : null
  }

  /**
   * 从缓存中获取到数据之后再删除它，你可以使用 pull 方法。
   * 和 get 方法一样，如果缓存中不存在该数据， 则返回 null
   */
  pull(key) {
    const value = this.get(key)

    if (value !== null) {
      setTimeout(() => {
        this.forget(key)
      }, 0)

      return value
    }

    return null
  }

  increment(key, amount = 1) {
    let value = this.get(key)

    if (!Number.isInteger(value)) {
      throw new ReferenceError('value is not Number')
    }

    value += amount
    this.cover(key, value)

    return value
  }

  decrement(key, amount = 1) {
    let value = this.get(key)

    if (!Number.isInteger(value)) {
      throw new ReferenceError('value is not Number')
    }

    value -= amount
    this.cover(key, value)

    return value
  }

  /**
   * 数据永久存储
   */
  forever(key, val) {
    this.put(key, val, 0)
  }

  forget(key) {
    delete win[this.strategy][key.toString()]
  }

  /**
   * 清空所有缓存
   */
  flush() {
    if (this.strategy === 'localStorage') {
      win.localStorage.clear()
    }

    if (this.strategy === 'sessionStorage') {
      win.sessionStorage.clear()
    }

    if (this.externStorage === 'externStorage') {
      win.externStorage = {}
    }
  }
}

export default CacheFacade
