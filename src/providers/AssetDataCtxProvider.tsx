import {
  TAssetId,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
  TSubtitlesData,
} from "@/@types/types";
import { loadAssetData } from "@/utils/assetDataUtil";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type TVideoPlayerAssets =
  | {
      assetId: "";
      movieSrc: "";
      subtitlesData: TSubtitlesData;
      assetsReady: false;
      subtitlesDataReady: false;
    }
  | {
      assetId: TAssetId;
      movieSrc: string;
      subtitlesData: TSubtitlesData;
      assetsReady: boolean;
      subtitlesDataReady: boolean;
    };

export type TDocumentPlayerAssets = {
  scrollTl: TServerGeneratedScrollTimeline | null;
  activityTl: TServerGeneratedActivityTimeline | null;
  baseImageSrc: string;
  assetsReady: boolean;
};

const initialVideoPlayerAssets: TVideoPlayerAssets = {
  assetId: "",
  movieSrc: "",
  subtitlesData: [],
  assetsReady: false,
  subtitlesDataReady: false,
};
const initialDocumentPlayerAssets: TDocumentPlayerAssets = {
  scrollTl: null,
  activityTl: null,
  baseImageSrc: "",
  assetsReady: false,
};

export type TAssetDataCtx = {
  videoPlayerAssets: TVideoPlayerAssets;
  documentPlayerAssets: TDocumentPlayerAssets;
};

export const AssetDataCtx = createContext<TAssetDataCtx>({
  videoPlayerAssets: initialVideoPlayerAssets,
  documentPlayerAssets: initialDocumentPlayerAssets,
});

export default function AssetDataCtxProvider(
  props: PropsWithChildren<{
    assetId: TAssetId;
  }>
) {
  const [videoPlayerAssets, setVideoPlayerAssets] =
    useState<TVideoPlayerAssets>(initialVideoPlayerAssets);
  const [documentPlayerAssets, setDocumentPlayerAssets] =
    useState<TDocumentPlayerAssets>(initialDocumentPlayerAssets);

  const currentAssetId = useRef("");

  const loadVideoPlayerAssets = useCallback(
    async (assetId: TAssetId) => {
      console.log("Loading video player assets...");
      const loadedMovieSrc =
        (await loadAssetData<string>(assetId, "movie", "mp4")) ?? "";
      const loadedSubtitlesData =
        (await loadAssetData<TSubtitlesData>(assetId, "subtitles", "json")) ??
        [];
      console.log(
        "Video player assets loaded.",
        loadedMovieSrc,
        loadedSubtitlesData
      );

      setVideoPlayerAssets({
        assetId,
        movieSrc: loadedMovieSrc,
        subtitlesData: loadedSubtitlesData,
        assetsReady: true,
        subtitlesDataReady: loadedSubtitlesData.length > 0,
      });
    },
    [setVideoPlayerAssets]
  );

  const loadDocumentPlayerAssets = useCallback(async (assetId: TAssetId) => {
    console.log("Loading document player assets...");
    const loadedDocumentImageData =
      (await loadAssetData<string>(assetId, `${assetId}.concat`, "png")) ?? "";

    const loadedScrollTlData =
      await loadAssetData<TServerGeneratedScrollTimeline>(
        assetId,
        `${assetId}.timeline.scroll`,
        "json"
      );

    const loadedActivityTlData =
      await loadAssetData<TServerGeneratedActivityTimeline>(
        assetId,
        `${assetId}.timeline.activity`,
        "json"
      );
    console.log(
      "Document player assets loaded.",
      loadedScrollTlData,
      loadedActivityTlData
    );

    setDocumentPlayerAssets({
      baseImageSrc: loadedDocumentImageData,
      scrollTl: loadedScrollTlData,
      activityTl: loadedActivityTlData,
      assetsReady: true,
    });
  }, []);

  useEffect(() => {
    if (currentAssetId.current !== props.assetId) {
      console.log("Loading assets...");
      currentAssetId.current = props.assetId;
      loadVideoPlayerAssets(props.assetId);
      loadDocumentPlayerAssets(props.assetId);
    }
  }, [props.assetId]);

  return (
    <AssetDataCtx.Provider
      value={{
        videoPlayerAssets,
        documentPlayerAssets,
      }}
    >
      {props.children}
    </AssetDataCtx.Provider>
  );
}
