import React, { useEffect, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useAssetData } from "@/hooks/useAssetDataLoader";
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
  preGeneratedScrollTimelineDataAtom,
  subtitlesDataAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
  videoSrcAtom,
} from "@/providers/jotai/swapVidPlayer";
import { TAssetId } from "@/types/swapvid";

export const SwapVidPlayerRoot: React.FC<{
  mediaSourceType?: "streaming" | "local" | "presets";
  zIndex?: number;
  swapvidDesktopEnabled?: boolean;
}> = ({ zIndex }) => {
  const assetId = useAtomValue(assetIdAtom);
  const interfaceType = useAtomValue(swapvidInterfaceTypeAtom);
  const swapvidDesktopEnabled = useAtomValue(swapvidDesktopEnabledAtom);
  const assetLoaderState = useAtomValue(assetLoaderStateAtom);

  const setPdfSrc = useSetAtom(pdfSrcAtom);
  const setVideoSrc = useSetAtom(videoSrcAtom);
  const setDocumentOverviewImgSrc = useSetAtom(documentOverviewImgSrcAtom);
  const setSubtitlesData = useSetAtom(subtitlesDataAtom);
  const setPreGeneratedScrollTimelineData = useSetAtom(
    preGeneratedScrollTimelineDataAtom
  );
  const setLocalFilePickerActive = useSetAtom(localFilePickerActiveAtom);

  /** Load Assets Here */
  const {
    loadDocumentOverviewImgSrc,
    loadPdfSrc,
    loadVideoSrc,
    loadSubtitlesData,
    loadPreGeneratedScrollTimelineData,
  } = useAssetData();

  const importDefaultAssetsOnRuntime = useCallback(
    async (
      assetId: TAssetId,
      options?: {
        skipLoadPdfSrc?: boolean;
        skipLoadVideoSrc?: boolean;
      }
    ) => {
      const [
        documentOverviewImgSrc,
        subtitlesData,
        preGeneratedScrollTimelineData,
      ] = await Promise.all([
        loadDocumentOverviewImgSrc(assetId),
        loadSubtitlesData(assetId),
        loadPreGeneratedScrollTimelineData(assetId),
      ]);

      const videoSrc = options?.skipLoadVideoSrc
        ? null
        : await loadVideoSrc(assetId);
      const pdfSrc = options?.skipLoadPdfSrc ? null : await loadPdfSrc(assetId);

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
    assetId &&
      importDefaultAssetsOnRuntime(assetId, {
        skipLoadVideoSrc: !assetLoaderState.video.presetsEnabled,
        skipLoadPdfSrc: !assetLoaderState.video.presetsEnabled,
      });

    if (
      !assetLoaderState.video.presetsEnabled ||
      !assetLoaderState.video.presetsEnabled
    ) {
      setLocalFilePickerActive(true);
    }
  }, [
    assetId,
    importDefaultAssetsOnRuntime,
    assetLoaderState,
    swapvidDesktopEnabled,
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
