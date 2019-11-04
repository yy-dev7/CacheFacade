interface CacheFacade {
  put(key: string, value: any, millisecond?: number): void;

  get(key: string, defaultValue?: any): any;

  add(key: string, value: any, millisecond?: number): boolean;

  has(key: string): boolean;

  pull(key: string): any;

  forever(key: string, value: any): void;

  increment(key: string, amount?: number): number;

  decrement(key: string, amount?: number): number;

  cover(key: string, value: any): void;

  forget(key: string): void;

  flush(): void;
}

export default CacheFacade