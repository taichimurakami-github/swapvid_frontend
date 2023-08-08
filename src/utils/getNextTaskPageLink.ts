export const getNextTaskPageLink = (
  nextId: number,
  t?: number,
  autoPlay?: boolean,
  disablePauseAndPlay?: boolean,
  disableSeekbar?: boolean
) => {
  let nextTaskPageLink = `./task${nextId < 10 ? "0" + nextId : nextId}`;
  let optionsAttached = false;

  const options = {
    t: t ?? null,
    autoPlay: autoPlay ?? null,
    disablePauseAndPlay: disablePauseAndPlay ?? null,
    disableSeekbar: disableSeekbar ?? null,
  };

  for (const key in options) {
    const k = key as keyof typeof options;

    if (options[k] === null) {
      delete options[k];
      continue;
    }

    const prefix = optionsAttached ? "&" : "?";
    nextTaskPageLink += prefix + `${k}=${options[k]}`;
    optionsAttached = true;
  }

  return nextTaskPageLink;
};
