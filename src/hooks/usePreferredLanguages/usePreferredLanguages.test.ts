import { renderHook } from '@solidjs/testing-library';
import { usePreferredLanguages } from './usePreferredLanguages';

const mockNavigatorLanguages = vi.spyOn(navigator, 'languages', 'get');

describe('usePreferredLanguages', () => {
  it('Should use preferred languages', () => {
    mockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR']);
    const { result } = renderHook(usePreferredLanguages);
    expect(result()).toEqual(['en', 'en-US', 'fr', 'fr-FR']);
  });

  it('Should change value upon language changes', () => {
    mockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR']);
    const { result } = renderHook(usePreferredLanguages);
    expect(result()).toEqual(['en', 'en-US', 'fr', 'fr-FR']);

    mockNavigatorLanguages.mockReturnValue([
      'en',
      'en-US',
      'fr',
      'fr-FR',
      'de',
    ]);
    window.dispatchEvent(new Event('languagechange'));
    expect(result()).toEqual(['en', 'en-US', 'fr', 'fr-FR', 'de']);
  });
});
