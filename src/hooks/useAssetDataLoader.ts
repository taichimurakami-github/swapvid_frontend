import {
  TAssetId,
  TServerGeneratedScrollTimeline,
  TSubtitlesData,
} from "@/types/swapvid";
import { useCallback } from "react";

/**
 * Assets loader using dynamic import.
 * Can be used for runtime loading of assets.
 * This feature is currently deprecated due to significantly increasing the bundle size.
 */

/**
 * Helper for importing assets
 * using v3 dynamic import
 */
const loadAssetData = <T>(
  assetId: TAssetId,
  filenameWoExt: string,
  ext: string
): Promise<T | null> => {
  // [WARNING]
  // Dynamic import doesn't work except "/" just before filename,
  // and "." between filename and extension.
  // Also, "import" syntax needs literal string, not valiable of string.
  //
  return import(`@assets/${assetId}/${filenameWoExt}.${ext}`)
    .then((v) => v.default as T)
    .catch((e) => {
      console.log(e);
      return null;
    });
};

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
