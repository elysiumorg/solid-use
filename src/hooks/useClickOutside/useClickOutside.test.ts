import { renderHook } from '@solidjs/testing-library';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('Should use click outside', () => {
    const { result } = renderHook(() => useClickOutside(vi.fn()));

    expect(result(null)).toEqual(null);
  });

  it('Should not call callback when ref connected to the document', () => {
    const callback = vi.fn();

    const element = document.createElement('div');

    const { result } = renderHook(() => useClickOutside(element, callback));
    Object.assign(() => result, element);

    document.dispatchEvent(new Event('mousedown'));
    document.dispatchEvent(new Event('touchstart'));

    expect(callback).toBeCalledTimes(2);
  });

  it('Should call callback when clicked outside the element', () => {
    const callback = vi.fn();
    const element = document.createElement('div');

    renderHook(() => useClickOutside(element, callback));

    expect(callback).not.toBeCalled();

    document.dispatchEvent(new Event('mousedown'));
    document.dispatchEvent(new Event('touchstart'));

    expect(callback).toBeCalledTimes(2);
  });

  it('Should call callback when clicked outside the ref', () => {
    const callback = vi.fn();
    const ref = document.createElement('div');

    renderHook(() => useClickOutside(ref, callback));

    expect(callback).not.toBeCalled();

    document.dispatchEvent(new Event('mousedown'));
    document.dispatchEvent(new Event('touchstart'));

    expect(callback).toBeCalledTimes(2);
  });

  it('Should call callback when clicked outside the function that returns an element', () => {
    const callback = vi.fn();
    const getElement = () => document.createElement('div');

    renderHook(() => useClickOutside(getElement, callback));

    expect(callback).not.toBeCalled();

    document.dispatchEvent(new Event('mousedown'));
    document.dispatchEvent(new Event('touchstart'));

    expect(callback).toBeCalledTimes(2);
  });

  it('Should not call callback when clicked inside the ref', () => {
    const callback = vi.fn();
    const ref = document.createElement('div');
    document.body.appendChild(ref);

    renderHook(() => useClickOutside(ref, callback));

    ref.dispatchEvent(new Event('mousedown'));
    ref.dispatchEvent(new Event('touchstart'));

    expect(callback).not.toBeCalled();
  });

  it('Should not call callback when clicked inside the element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const callback = vi.fn();

    renderHook(() => useClickOutside(element, callback));

    element.dispatchEvent(new Event('mousedown'));
    element.dispatchEvent(new Event('touchstart'));

    expect(callback).not.toBeCalled();
  });

  it('Should not call callback when clicked inside the function that returns an element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const getElement = () => element;
    const callback = vi.fn();

    renderHook(() => useClickOutside(getElement, callback));

    element.dispatchEvent(new Event('mousedown'));
    element.dispatchEvent(new Event('touchstart'));

    expect(callback).not.toBeCalled();
  });

  it('Should call callback when clicked outside the element (multiple targets)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const elementForGetElementFunction = document.createElement('div');
    document.body.appendChild(elementForGetElementFunction);
    const getElement = () => elementForGetElementFunction;

    const ref = document.createElement('div');
    document.body.appendChild(ref);

    const callback = vi.fn();

    renderHook(() => useClickOutside([element, ref, getElement], callback));

    document.dispatchEvent(new Event('mousedown'));

    expect(callback).toBeCalledTimes(1);
  });
});
