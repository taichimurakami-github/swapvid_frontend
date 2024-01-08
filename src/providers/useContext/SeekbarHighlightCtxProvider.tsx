import React, { createContext, PropsWithChildren, useState } from "react";
import { TAssetId, TInterfaceMode } from "@/types/swapvid";

export type TSeekbarActiveTimes = [number, number, number][];

export type TSeekbarActiveTimesCtx = TSeekbarActiveTimes | null;
export const SeekbarActiveTimesCtx = createContext<TSeekbarActiveTimesCtx>([]);

export type TSetSeekbarActiveTimesCtx = React.Dispatch<
  React.SetStateAction<TSeekbarActiveTimes>
> | null;
export const SetSeekbarActiveTimesCtx =
  createContext<TSetSeekbarActiveTimesCtx>(null);

export default function SeekbarHighlightCtxProvider(
  props: PropsWithChildren<{
    playerMode: TInterfaceMode;
    assetId: TAssetId;
  }>
) {
  const [seekbarActiveTimes, setSeekbarActiveTimes] =
    useState<TSeekbarActiveTimes>([]);
  return (
    <SetSeekbarActiveTimesCtx.Provider value={setSeekbarActiveTimes}>
      <SeekbarActiveTimesCtx.Provider value={seekbarActiveTimes}>
        {props.children}
      </SeekbarActiveTimesCtx.Provider>
    </SetSeekbarActiveTimesCtx.Provider>
  );
}
