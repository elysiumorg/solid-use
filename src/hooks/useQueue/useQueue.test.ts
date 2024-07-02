import { describe, it, expect } from 'vitest';
import { createRoot } from 'solid-js';
import { useQueue } from './useQueue';

describe('useQueue', () => {
  it('should initialize with given initial values', () => {
    createRoot(dispose => {
      const { queue, first, last, size } = useQueue([1, 2, 3]);
      expect(queue()).toEqual([1, 2, 3]);
      expect(first()).toBe(1);
      expect(last()).toBe(3);
      expect(size()).toBe(3);
      dispose();
    });
  });

  it('should add elements to the queue', () => {
    createRoot(dispose => {
      const { add, queue, first, last, size } = useQueue<number>([]);
      add(1);
      expect(queue()).toEqual([1]);
      expect(first()).toBe(1);
      expect(last()).toBe(1);
      expect(size()).toBe(1);
      add(2);
      expect(queue()).toEqual([1, 2]);
      expect(first()).toBe(1);
      expect(last()).toBe(2);
      expect(size()).toBe(2);
      dispose();
    });
  });

  it('should remove elements from the queue', () => {
    createRoot(dispose => {
      const { add, remove, queue, first, last, size } = useQueue<number>([]);
      add(1);
      add(2);
      const removed = remove();
      expect(removed).toBe(1);
      expect(queue()).toEqual([2]);
      expect(first()).toBe(2);
      expect(last()).toBe(2);
      expect(size()).toBe(1);
      dispose();
    });
  });

  it('should clear the queue', () => {
    createRoot(dispose => {
      const { add, clear, queue, size } = useQueue<number>([]);
      add(1);
      add(2);
      clear();
      expect(queue()).toEqual([]);
      expect(size()).toBe(0);
      dispose();
    });
  });

  it('should handle removing from an empty queue', () => {
    createRoot(dispose => {
      const { remove, queue, size } = useQueue<number>([]);
      const removed = remove();
      expect(removed).toBeUndefined();
      expect(queue()).toEqual([]);
      expect(size()).toBe(0);
      dispose();
    });
  });
});
