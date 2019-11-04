import CacheFacade from "../index"

const drivers = ['localStorage', 'sessionStorage', 'globalVariable']

import { set, reset } from 'mockdate'
let now = Date.now()

function fastforward(time: any) {
  now += time
  set(now)
  jest.advanceTimersByTime(time)
}

test('get value', () => {
  drivers.forEach(driver => {
    const store = CacheFacade.store(driver)
    store.put('a', 1)
    expect(store.get('a')).toBe(1)
    store.flush()
  })
})

test('add value', () => {
  drivers.forEach(driver => {
    const store = CacheFacade.store(driver)
    store.put('a', 1)
    expect(store.add('a', 1)).toBe(false)
    expect(store.add('b', 1)).toBe(true)
    store.flush()
  })
})

test('has value', () => {
  drivers.forEach(driver => {
    const store = CacheFacade.store(driver)
    store.put('a', 1)
    expect(store.has('a')).toBe(true)
    expect(store.has('b')).toBe(false)
    store.flush()
  })
})

test('increment and decrement', () => {
  drivers.forEach(driver => {
    const store = CacheFacade.store(driver)
    store.put('a', 1)

    // increment
    expect(store.increment('a', 1)).toBe(2)
    expect(store.increment('a', 2)).toBe(4)

    // decrement
    expect(store.decrement('a', 1)).toBe(3)
    expect(store.decrement('a', 2)).toBe(1)

    store.flush()
  })
})

test('forget value', () => {
  drivers.forEach(driver => {
    const store = CacheFacade.store(driver)
    store.put('a', 1)
    store.forget('a')
    expect(store.get('a')).toBe(null)
    store.flush()
  })
})

test('put value with millisecond', () => {
  drivers.forEach(driver => {
    jest.useFakeTimers()
    const store = CacheFacade.store(driver)

    store.put('c', 'c-value', 1000)
    expect(store.get('c')).toBe('c-value')
    fastforward(2000)
    expect(store.get('c')).toBe(null)

    jest.useRealTimers()
    reset()
  })
})

test('pull value', () => {
  drivers.forEach(driver => {
    jest.useFakeTimers()
    const store = CacheFacade.store(driver)

    store.put('b', 1)
    expect(store.pull('b')).toBe(1)
    setTimeout(() => {
      expect(store.get('b')).toBe(null)
    }, 1000)

    jest.runAllTimers()
  })
})
