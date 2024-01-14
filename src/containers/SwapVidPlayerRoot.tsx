import React, { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai/react";
import {
  PlayerCombinedView,
  PlayerParallelView,
} from "@/presentations/SwapVidPlayerView";
import {
  assetIdAtom,
  assetLoaderStateAtom,
  documentOverviewImgSrcAtom,
  localFilePickerActiveAtom,
  pdfSrcAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
  videoSrcAtom,
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
  const videoSrc = useAtomValue(videoSrcAtom);
  const pdfSrc = useAtomValue(pdfSrcAtom);
  const documentOverviewImgSrc = useAtomValue(documentOverviewImgSrcAtom);

  const setLocalFilePickerActive = useSetAtom(localFilePickerActiveAtom);

  useEffect(() => {
    const localSourceRegistered =
      (!!videoSrc || swapvidDesktopEnabled) &&
      !!pdfSrc &&
      !!documentOverviewImgSrc;

    if (!localSourceRegistered) {
      setLocalFilePickerActive(true);
    }
  }, [
    assetId,
    assetLoaderState,
    swapvidDesktopEnabled,
    setLocalFilePickerActive,
    videoSrc,
    pdfSrc,
    documentOverviewImgSrc,
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
