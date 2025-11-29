import { jest } from '@jest/globals';
import { storage, getRandomItem, debounce } from '../../src/js/utils.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

describe('Utils', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
        // Since storage.get catches errors, we want to mock console.error to keep output clean if we test error cases
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('storage', () => {
        test('get returns parsed JSON from localStorage', () => {
            localStorageMock.getItem.mockReturnValue(JSON.stringify({ test: 'data' }));
            expect(storage.get('key')).toEqual({ test: 'data' });
            expect(localStorageMock.getItem).toHaveBeenCalledWith('key');
        });

        test('get returns defaultValue if item is null', () => {
            localStorageMock.getItem.mockReturnValue(null);
            expect(storage.get('key', 'default')).toBe('default');
        });

        test('get returns defaultValue if JSON parse fails', () => {
             localStorageMock.getItem.mockReturnValue('invalid json');
             expect(storage.get('key', 'default')).toBe('default');
        });

        test('set saves stringified JSON to localStorage', () => {
            storage.set('key', { test: 'data' });
            expect(localStorageMock.setItem).toHaveBeenCalledWith('key', JSON.stringify({ test: 'data' }));
        });

        test('remove deletes item from localStorage', () => {
            storage.remove('key');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('key');
        });
    });

    describe('getRandomItem', () => {
        test('returns an item from the array', () => {
            const arr = [1, 2, 3];
            const item = getRandomItem(arr);
            expect(arr).toContain(item);
        });
    });

    describe('debounce', () => {
        test('executes function after delay', () => {
            jest.useFakeTimers();
            const func = jest.fn();
            const debouncedFunc = debounce(func, 1000);

            debouncedFunc();
            expect(func).not.toHaveBeenCalled();

            jest.advanceTimersByTime(500);
            expect(func).not.toHaveBeenCalled();

            jest.advanceTimersByTime(500);
            expect(func).toHaveBeenCalled();

            jest.useRealTimers();
        });

        test('resets timer on subsequent calls', () => {
            jest.useFakeTimers();
            const func = jest.fn();
            const debouncedFunc = debounce(func, 1000);

            debouncedFunc();
            jest.advanceTimersByTime(500);
            debouncedFunc(); // Reset timer

            jest.advanceTimersByTime(500);
            expect(func).not.toHaveBeenCalled();

            jest.advanceTimersByTime(500);
            expect(func).toHaveBeenCalledTimes(1);

            jest.useRealTimers();
        });
    });
});
