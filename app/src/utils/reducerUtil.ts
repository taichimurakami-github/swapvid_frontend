// Batch state updates to prevent unnecessary re-renders:
// returns the previous state to reuse the same object on memory,
// if the next state is the same one as the previous state.
export const batchStateUpdates = <T = object>(prevState: T, nextState: T) =>
  JSON.stringify(prevState) === JSON.stringify(nextState)
    ? prevState
    : nextState;
