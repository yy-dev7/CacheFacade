import DriverManager from './DriverManager'
import { DriverClient, CacheConfig } from './types/index'
import GlobalVariableClient from "./clients/GlobalVariableClient";

class CacheFacade {
  static version = '2.0.0';

  static store(driver: string, config?: CacheConfig) {
    let client: DriverClient

    switch (driver) {
      case 'localStorage':
        client = window.localStorage
        break

      case 'sessionStorage':
        client = window.sessionStorage
        break

      case 'globalVariable':
        client = new GlobalVariableClient
        break

      default:
        throw new ReferenceError(`${driver} is not support`)
    }

    return new DriverManager(client, config)
  }
}

export default CacheFacade