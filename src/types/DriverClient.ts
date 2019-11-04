interface DriverClient {
  setItem(key: string, value: any): any;

  getItem(key: string): any;

  removeItem(key: string): void;

  clear(): void;
}

export default DriverClient