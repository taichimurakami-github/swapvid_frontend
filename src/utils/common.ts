export const getRangeArray = (i_end: number, i_start = 0) => {
  const _result = [];

  for (let i = i_start; i < i_start + i_end; i++) {
    _result.push(i);
  }

  return _result;
};
