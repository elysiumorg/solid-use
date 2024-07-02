import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useStorage } from './useStorage';

// Mock the isClient utility
vi.mock('@/utils/helpers', () => ({
  isClient: true,
}));

describe('useStorage', () => {
  let storageMock: Storage;

  beforeEach(() => {
    storageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    } as unknown as Storage;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with the default value if no value in storage', () => {
    const initialValue = 'default';
    const [value] = useStorage(storageMock, 'testKey', { initialValue });

    expect(value()).toBe(initialValue);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(storageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should read the stored value from storage', () => {
    const storedValue = 'storedValue';
    storageMock.getItem = vi.fn(() => JSON.stringify(storedValue));

    const [value] = useStorage(storageMock, 'testKey', {
      initialValue: 'default',
    });

    expect(value()).toBe(storedValue);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(storageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should store a new value in storage', () => {
    const [value, setValue] = useStorage<string>(storageMock, 'testKey', {
      initialValue: 'default',
    });

    setValue('newValue');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(storageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify('newValue'),
    );
    expect(value()).toBe('newValue');
  });

  it('should remove the value from storage', () => {
    const initialValue = 'default';
    const [value, , removeValue] = useStorage(storageMock, 'testKey', {
      initialValue,
    });

    removeValue();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(storageMock.removeItem).toHaveBeenCalledWith('testKey');
    expect(value()).toBe(initialValue);
  });

  it('should handle JSON parsing errors gracefully', () => {
    storageMock.getItem = vi.fn(() => 'invalidJSON');
    const initialValue = 'default';

    const [value] = useStorage(storageMock, 'testKey', { initialValue });

    expect(value()).toBe(initialValue);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(storageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should call the serializer when setting a value', () => {
    const serializer = vi.fn(value => `serialized-${value}`);
    const [value, setValue] = useStorage(storageMock, 'testKey', {
      initialValue: 'default',
      serializer,
    });

    setValue('newValue');

    expect(serializer).toHaveBeenCalledWith('newValue');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(storageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      'serialized-newValue',
    );
    expect(value()).toBe('newValue');
  });

  it('should call the deserializer when reading a value', () => {
    const deserializer = vi.fn(() => 'deserializedValue');
    storageMock.getItem = vi.fn(() => 'storedValue');

    const [value] = useStorage(storageMock, 'testKey', {
      initialValue: 'default',
      deserializer,
    });

    expect(deserializer).toHaveBeenCalledWith('storedValue');
    expect(value()).toBe('deserializedValue');
  });

  it('should update the signal when storage changes', () => {
    const [value] = useStorage(storageMock, 'testKey', {
      initialValue: 'default',
    });
    const storageEvent = new StorageEvent('storage', { key: 'testKey' });

    storageMock.getItem = vi.fn(() => JSON.stringify('newStoredValue'));
    window.dispatchEvent(storageEvent);

    expect(value()).toBe('newStoredValue');
  });
});
