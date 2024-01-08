import React, { useEffect, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useAssetData } from "@/hooks/useAssetDataLoader";
import {
  PlayerCombinedView,
  PlayerParallelView,
} from "@/presentations/SwapVidPlayerView";
import {
  assetIdAtom,
  documentOverviewImgSrcAtom,
  pdfSrcAtom,
  preGeneratedScrollTimelineDataAtom,
  subtitlesDataAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
  videoSrcAtom,
} from "@/providers/jotai/swapVidPlayer";
import { TAssetId } from "@/types/swapvid";

export const SwapVidPlayerRoot: React.FC<{
  zIndex?: number;
  swapvidDesktopEnabled?: boolean;
}> = ({ zIndex }) => {
  const assetId = useAtomValue(assetIdAtom);
  const interfaceType = useAtomValue(swapvidInterfaceTypeAtom);
  const swapvidDesktopEnabled = useAtomValue(swapvidDesktopEnabledAtom);

  const setPdfSrc = useSetAtom(pdfSrcAtom);
  const setVideoSrc = useSetAtom(videoSrcAtom);
  const setDocumentOverviewImgSrc = useSetAtom(documentOverviewImgSrcAtom);
  const setSubtitlesData = useSetAtom(subtitlesDataAtom);
  const setPreGeneratedScrollTimelineData = useSetAtom(
    preGeneratedScrollTimelineDataAtom
  );

  /** Load Assets Here */
  const {
    loadDocumentOverviewImgSrc,
    loadPdfSrc,
    loadVideoSrc,
    loadSubtitlesData,
    loadPreGeneratedScrollTimelineData,
  } = useAssetData();

  const importAssetsOnRuntime = useCallback(
    async (assetId: TAssetId) => {
      const [
        documentOverviewImgSrc,
        videoSrc,
        pdfSrc,
        subtitlesData,
        preGeneratedScrollTimelineData,
      ] = await Promise.all([
        loadDocumentOverviewImgSrc(assetId),
        loadVideoSrc(assetId),
        loadPdfSrc(assetId),
        loadSubtitlesData(assetId),
        loadPreGeneratedScrollTimelineData(assetId),
      ]);

      setPdfSrc(pdfSrc);
      setVideoSrc(videoSrc);
      setDocumentOverviewImgSrc(documentOverviewImgSrc);
      setSubtitlesData(subtitlesData);
      setPreGeneratedScrollTimelineData(preGeneratedScrollTimelineData);
    },
    [
      loadDocumentOverviewImgSrc,
      loadPdfSrc,
      loadVideoSrc,
      loadSubtitlesData,
      loadPreGeneratedScrollTimelineData,
      setPdfSrc,
      setVideoSrc,
      setDocumentOverviewImgSrc,
      setSubtitlesData,
      setPreGeneratedScrollTimelineData,
    ]
  );

  useEffect(() => {
    assetId && importAssetsOnRuntime(assetId);
  }, [assetId, importAssetsOnRuntime, swapvidDesktopEnabled]);

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
