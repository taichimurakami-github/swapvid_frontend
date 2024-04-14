import React from "react";

export const checkIfProvidedRefsAreExists = (refs: {
  [key: string]: React.RefObject<unknown>;
}) => {
  const isRefInitialized =
    Object.values(refs).filter((v) => v === undefined && v === null).length ===
    0;

  const isCurrentInitialized =
    Object.values(refs).filter(
      (v) => v.current === undefined && v.current === null
    ).length === 0;

  return refs && isRefInitialized && isCurrentInitialized;
};
