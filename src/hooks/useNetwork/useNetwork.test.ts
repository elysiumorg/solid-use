import { renderHook } from '@solidjs/testing-library';
import { useNetwork } from './useNetwork';

const mockNavigatorOnline = vi.spyOn(navigator, 'onLine', 'get');

describe('useNetwork', () => {
  it('Should use network', () => {
    const { result } = renderHook(useNetwork);

    expect(result().online).toBeTruthy();
  });

  it('Should change state upon network events', () => {
    mockNavigatorOnline.mockReturnValue(true);
    const { result } = renderHook(useNetwork);
    expect(result().online).toBeTruthy();

    mockNavigatorOnline.mockReturnValue(false);
    window.dispatchEvent(new Event('offline'));
    expect(result().online).toBeFalsy();

    mockNavigatorOnline.mockReturnValue(true);
    window.dispatchEvent(new Event('online'));
    expect(result().online).toBeTruthy();
  });
});
