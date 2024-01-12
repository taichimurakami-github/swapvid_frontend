import React, { useEffect, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai/react";
import {
  PlayerCombinedView,
  PlayerParallelView,
} from "@/presentations/SwapVidPlayerView";
import {
  assetIdAtom,
  assetLoaderStateAtom,
  localFilePickerActiveAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
} from "@/providers/jotai/store";
// import { TAssetId } from "@/types/swapvid";

export const SwapVidPlayerRoot: React.FC<{
  mediaSourceType?: "streaming" | "local" | "presets";
  zIndex?: number;
  swapvidDesktopEnabled?: boolean;
}> = ({ zIndex }) => {
  const assetId = useAtomValue(assetIdAtom);
  const interfaceType = useAtomValue(swapvidInterfaceTypeAtom);
  const swapvidDesktopEnabled = useAtomValue(swapvidDesktopEnabledAtom);
  const assetLoaderState = useAtomValue(assetLoaderStateAtom);

  const setLocalFilePickerActive = useSetAtom(localFilePickerActiveAtom);

  useEffect(() => {
    const localSourceExists = Object.values(assetLoaderState)
      .map((v) => v.sourceType)
      .includes("local");

    if (localSourceExists) {
      setLocalFilePickerActive(true);
    }
  }, [
    assetId,
    assetLoaderState,
    swapvidDesktopEnabled,
    setLocalFilePickerActive,
  ]);

  switch (interfaceType) {
    case "combined":
      return (
        <PlayerCombinedView
          zIndex={zIndex}
          swapvidDesktopEnabled={swapvidDesktopEnabled}
        />
      );

    case "parallel":
      return <PlayerParallelView zIndex={zIndex} />;
  }
};
