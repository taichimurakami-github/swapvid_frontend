export const formatCurrentTimeIntoHMSString = (currentTime_sec: number) => {
  const roundedTime = Math.round(Math.abs(currentTime_sec));
  const minutes = Math.floor(roundedTime / 60);
  const hours = Math.floor(minutes / 60);
  const seconds = roundedTime % 60;

  const prefix = currentTime_sec < 0 ? "-" : "";
  const hours_str = hours > 0 ? `${hours}:` : "";
  const minutes_str = minutes < 10 ? "0" + minutes : minutes;
  const seconds_str = seconds < 10 ? "0" + seconds : seconds;

  return `${prefix}${hours_str}${minutes_str}:${seconds_str}`;
};
