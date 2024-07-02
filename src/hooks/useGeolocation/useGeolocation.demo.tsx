import { useGeolocation } from './useGeolocation';

const Demo = () => {
  const geolocation = useGeolocation();

  return (
    <div>
      <pre>{JSON.stringify(geolocation(), null, 2)}</pre>
    </div>
  );
};

export default Demo;
