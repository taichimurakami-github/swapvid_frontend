import {
  TAssetId,
  TServerGeneratedScrollTimeline,
  TSubtitlesData,
} from "@/types/swapvid";
import { useCallback } from "react";
import { loadAssetData } from "@utils/assetDataUtil";

export function useAssetData() {
  const loadVideoSrc = useCallback(
    async (assetId: TAssetId) =>
      (await loadAssetData<string>(assetId, "movie", "mp4")) ?? "",
    []
  );

  const loadSubtitlesData = useCallback(
    async (assetId: TAssetId) =>
      (await loadAssetData<TSubtitlesData>(assetId, "subtitles", "json")) ??
      null,
    []
  );

  const loadDocumentOverviewImgSrc = useCallback(
    async (assetId: TAssetId) =>
      (await loadAssetData<string>(assetId, `${assetId}.concat`, "png")) ?? "",
    []
  );

  const loadPdfSrc = useCallback(
    async (assetId: TAssetId) =>
      (await loadAssetData<string>(assetId, `${assetId}`, "pdf")) ?? "",
    []
  );

  const loadPreGeneratedScrollTimelineData = useCallback(
    async (assetId: TAssetId) =>
      await loadAssetData<TServerGeneratedScrollTimeline>(
        assetId,
        `${assetId}.timeline.scroll`,
        "json"
      ),
    []
  );

  return {
    loadDocumentOverviewImgSrc,
    loadPdfSrc,
    loadPreGeneratedScrollTimelineData,
    loadSubtitlesData,
    loadVideoSrc,
  };
}
