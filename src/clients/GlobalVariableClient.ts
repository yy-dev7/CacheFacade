import { DriverClient, CustomWindow } from '../types/index'

declare let window: CustomWindow

class GlobalVariableDriver implements DriverClient {
  constructor() {
    window.__globalCacheObject__ = typeof window.__globalCacheObject__ === 'undefined' ? {} : window.__globalCacheObject__
  }

  setItem(key: string, value: any) {
    window.__globalCacheObject__[key] = value
  }  
  
  getItem(key: string) {
    return window.__globalCacheObject__[key]
  }

  removeItem(key: string) {
    delete window.__globalCacheObject__[key]
  }

  clear(): void {
    window.__globalCacheObject__ = {}
  }
}

export default GlobalVariableDriver