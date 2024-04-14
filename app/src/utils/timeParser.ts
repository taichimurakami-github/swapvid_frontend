export const parseStrFormatTime = (strFormatTime: string) => {
  const secMinHour_strArray = strFormatTime.split(":").reverse();

  let delta = 1;
  let result = 0;

  for (const val of secMinHour_strArray) {
    result += Number(val) * delta;
    delta *= 60;
  }

  return result;
};

export const isTimeBetweenStrFormat = (
  min_strFormat: string,
  time: number,
  max_strFormat: string
) => {
  const min = parseStrFormatTime(min_strFormat);
  const max = parseStrFormatTime(max_strFormat);

  return min <= time && time <= max;
};
