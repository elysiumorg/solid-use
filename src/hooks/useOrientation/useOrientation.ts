import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

/** The use orientation return type */
export interface UseOrientationReturn {
  /** The current screen orientation angle */
  angle: number;
  /** The screen orientation type */
  type: OrientationType;
}

/**
 * @name useOrientation
 * @description - Hook that returns the current screen orientation
 * @category Browser
 *
 * @returns {UseOrientationReturn} An object containing the current screen orientation
 *
 * @example
 * const { angle, type } = useOrientation();
 */
export const useOrientation = (): Accessor<UseOrientationReturn> => {
  const [orientation, setOrientation] = createSignal<UseOrientationReturn>({
    angle: 0,
    type: 'landscape-primary',
  });

  createEffect(() => {
    const onChange = () => {
      const { angle, type } = window.screen.orientation;
      setOrientation({
        angle,
        type,
      });
    };

    window.screen.orientation?.addEventListener('change', onChange);

    onCleanup(() => {
      window.screen.orientation?.removeEventListener('change', onChange);
    });
  }, []);

  return orientation;
};
