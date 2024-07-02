import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js';

/** The use geolocation return type */
export interface UseGeolocationReturn {
  /** The loading state */
  loading: boolean;
  /** The error of the last position update */
  error: GeolocationPositionError | null;
  /** The timestamp of the last position update */
  timestamp: number | null;
  /** The accuracy of the last position update */
  accuracy: number | null;
  /** The latitude of the last position update */
  latitude: number | null;
  /** The longitude of the last position update */
  longitude: number | null;
  /** The altitude of the last position update */
  altitude: number | null;
  /** The altitude accuracy of the last position update */
  altitudeAccuracy: number | null;
  /** The heading of the last position update */
  heading: number | null;
  /** The speed of the last position update */
  speed: number | null;
}

/** The use geolocation params */
export type UseGeolocationParams = PositionOptions;

/**
 * @name useGeolocation
 * @description - Hook that returns the current geolocation
 * @category Browser
 *
 * @param {boolean} [params.enableHighAccuracy] Enable high accuracy
 * @param {number} [params.maximumAge] Maximum age
 * @param {number} [params.timeout] Timeout
 * @returns {UseGeolocationReturn}
 *
 * @example
 * const { loading, error, timestamp, accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed } = useGeolocation();
 */
export const useGeolocation = (
  params?: UseGeolocationParams,
): Accessor<UseGeolocationReturn> => {
  const [value, setValue] = createSignal<UseGeolocationReturn>({
    loading: true,
    error: null,
    timestamp: Date.now(),
    accuracy: 0,
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.POSITIVE_INFINITY,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  });

  createEffect(() => {
    const onEvent = ({ coords, timestamp }: GeolocationPosition) => {
      setValue({
        ...value,
        loading: false,
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
      } as UseGeolocationReturn);
    };

    const onEventError = (error: GeolocationPositionError) => {
      setValue({
        ...value,
        loading: false,
        error,
      } as UseGeolocationReturn);
    };

    navigator.geolocation.getCurrentPosition(onEvent, onEventError, params);
    const watchId = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      params,
    );

    onCleanup(() => {
      navigator.geolocation.clearWatch(watchId);
    });
  });

  return value;
};
