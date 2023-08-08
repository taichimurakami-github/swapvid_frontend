export const getHMFormatCurrentTime = (currentTime_sec: number) => {
  const roundedTime = Math.round(Math.abs(currentTime_sec));
  const minutes = Math.floor(roundedTime / 60);
  const seconds = roundedTime % 60;

  const prefix = currentTime_sec < 0 ? "-" : "";
  const minutes_str = minutes < 10 ? "0" + minutes : minutes;
  const seconds_str = seconds < 10 ? "0" + seconds : seconds;

  return `${prefix}${minutes_str}:${seconds_str}`;
};
