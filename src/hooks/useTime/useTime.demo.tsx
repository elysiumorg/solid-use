import { useTime } from './useTime';

const Demo = () => {
  const time = useTime();

  return (
    <div>
      <p>
        Date{' '}
        <code>
          {time().month}/{time().day}/{time().year}
        </code>
      </p>
      <p>
        Time{' '}
        <code>
          {time().hours}:{time().minutes}:{time().seconds}
        </code>
      </p>

      <p>
        Meridiem hours:{' '}
        <span>
          <code>
            {time().meridiemHours.value}
            {time().meridiemHours.type}
          </code>
        </span>
      </p>
    </div>
  );
};

export default Demo;
