import { renderHook } from '@solidjs/testing-library';
import { useOnline } from './useOnline';

const mockNavigatorOnline = vi.spyOn(navigator, 'onLine', 'get');

describe('useOnline', () => {
  it('Should use online', () => {
    mockNavigatorOnline.mockReturnValue(true);
    const { result } = renderHook(useOnline);
    expect(result()).toBeTruthy();
  });

  it('Should change value upon network events', () => {
    mockNavigatorOnline.mockReturnValue(true);
    const { result } = renderHook(useOnline);
    expect(result()).toBeTruthy();

    mockNavigatorOnline.mockReturnValue(false);
    window.dispatchEvent(new Event('offline'));
    expect(result()).toBeFalsy();

    mockNavigatorOnline.mockReturnValue(true);
    window.dispatchEvent(new Event('online'));
    expect(result()).toBeTruthy();
  });
});
