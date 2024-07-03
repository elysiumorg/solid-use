export const getDate = (now: Date = new Date()) => {
  const seconds =
    String(now.getSeconds()).length === 1
      ? `0${now.getSeconds()}`
      : now.getSeconds().toString();
  const minutes =
    String(now.getMinutes()).length === 1
      ? `0${now.getMinutes()}`
      : now.getMinutes().toString();
  const hours =
    String(now.getHours()).length === 1
      ? `0${now.getHours()}`
      : now.getHours().toString();
  const meridiemHours = (
    Number(hours) % 12 === 0 ? 12 : Number(hours) % 12
  ).toString();
  const meridiemType = Number(hours) >= 12 ? 'pm' : 'am';
  const day = now.getDate().toString();
  const month =
    String(now.getMonth()).length === 1
      ? `0${now.getMonth()}`
      : now.getMonth().toString();
  const year = now.getFullYear().toString();
  const timestamp = now.getTime();

  return {
    seconds,
    minutes,
    hours,
    meridiemHours: { value: meridiemHours, type: meridiemType },
    day,
    month,
    year,
    timestamp,
  };
};
