import { CacheFacade, CacheConfig, DriverClient, INumber } from './types/index'

declare const Number: INumber

class DriverManager implements CacheFacade {
  client: DriverClient;
  config: CacheConfig;

  constructor(client: DriverClient, config: CacheConfig = {}) {
    this.client = client
    this.config = config
  }

  put(key: string, value: any, millisecond?: number): void {
    const data = {
      value,
      expires: this.getExpires(millisecond)
    }
    this.client.setItem(this.getKey(key), JSON.stringify(data))
  }

  get(key: string, defaultValue?: any) {
    const originData = this.client.getItem(this.getKey(key))
    const data = originData && JSON.parse(originData)

    if (data) {
      // expires 视为永久存储
      if (data.expires === 0) {
        return data.value
      }

      // 在有效期内
      if (Date.now() < data.expires) {
        return data.value
      }

      // 已过期
      this.forget(key)
    }

    return defaultValue || null
  }

  add(key: string, value: any, millisecond?: number): boolean {
    if (this.get(key) === null) {
      this.put(key, value, millisecond)
      return true
    }

    return false
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  pull(key: string): any {
    const value = this.get(this.getKey(key))

    if (value !== null) {
      setTimeout(() => {
        this.forget(this.getKey(key))
      }, 0)

      return value
    }

    return null
  }

  /**
   * 覆盖 value的值，但是不更新过期时间
   * @param key
   * @param value 
   */
  cover(key: string, value: any): void {
    const originData = this.client.getItem(this.getKey(key))
    const data = originData && JSON.parse(originData)

    if (data) {
      data.value = value
      this.client.setItem(this.getKey(key), JSON.stringify(data))
    }
  }

  increment(key: string, amount: number = 1): number {
    let value = this.get(key)
    if (!Number.isInteger(value)) {
      throw new ReferenceError(`${value} is not an Integer`)
    }

    value += amount
    this.cover(key, value)

    return value
  }

  decrement(key: string, amount: number = 1): number {
    let value = this.get(key)
    if (!Number.isInteger(value)) {
      throw new ReferenceError(`${value} is not an Integer`)
    }

    value -= amount
    this.cover(key, value)

    return value
  }

  forever(key: string, value: any): void {
    this.put(key, value, 0)
  }

  forget(key: string): void {
   this.client.removeItem(this.getKey(key))
  }

  flush(): void {
    this.client.clear()
  }

  getExpires(millisecond: number = 0): number {
    return millisecond === 0 ? 0 : Date.now() + millisecond
  }

  getKey(key: string): string {
    if (this.config.prefix) {
      return this.config.prefix + key
    }

    return key
  }
}

export default DriverManager