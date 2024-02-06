export const getJotaiStorageKey = (key: string, primitive = true) =>
  `jotai.atom.${primitive ? "primitive" : "derived"}.${key}`;
