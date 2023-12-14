import { TInterfaceMode } from "@/types/swapvid";
import React, { useState } from "react";

export default function useDocumentPlayerCore(mode: TInterfaceMode) {
  const [documentPlayerState, setDocumentPlayerState] = useState<{
    mode: TInterfaceMode;
    standby: boolean;
    active: boolean;
    unableScrollTo: number;
    activeTimes: [number, number][];
  }>({
    mode: mode,
    standby: false,
    active: false,
    unableScrollTo: 0,
    activeTimes: [],
  });

  const handleDocumentPlayerActiveTimes = (value: [number, number][]) =>
    setDocumentPlayerState((s) => ({ ...s, activeTimes: value }));

  const handleDocumentPlayerActive = (value: boolean) => {
    console.log(value);
    setDocumentPlayerState((s) => ({ ...s, active: value }));
  };

  const handleDocumentPlayerStandby = (value: boolean) =>
    setDocumentPlayerState((s) => ({ ...s, standby: value }));

  return {
    documentPlayerState,
    handleDocumentPlayerActive,
    handleDocumentPlayerStandby,
    handleDocumentPlayerActiveTimes,
  };
}
