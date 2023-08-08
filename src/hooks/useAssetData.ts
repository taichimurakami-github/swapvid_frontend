import { TAssetId, TSubtitlesData } from "@/@types/types";
import React, { useEffect, useState } from "react";
import { loadAssetData } from "@/utils/assetDataUtil";

export type TAssetDataCtx =
  | {
      assetId: "";
      movieSrc: string;
      subtitlesData: TSubtitlesData;
      assetsReady: boolean;
      subtitlesDataReady: boolean;
    }
  | {
      assetId: TAssetId;
      movieSrc: string;
      subtitlesData: TSubtitlesData;
      assetsReady: boolean;
      subtitlesDataReady: boolean;
    };

export type TSetAssetDataCtx = {
  importAssetData: (assetId: TAssetId) => Promise<void>;
  initializeAssetData: () => void;
};

const initialAssetDataState: TAssetDataCtx = {
  assetId: "",
  movieSrc: "",
  subtitlesData: [],
  assetsReady: false,
  subtitlesDataReady: false,
};

export default function useAssetData(assetId: TAssetId) {
  const [assetDataState, setAssetDataState] = useState<TAssetDataCtx>(
    initialAssetDataState
  );

  useEffect(() => {
    (async () => {
      const loadedMovieSrc =
        (await loadAssetData<string>(assetId, "movie", "mp4")) ?? "";
      const loadedSubtitlesData =
        (await loadAssetData<TSubtitlesData>(assetId, "subtitles", "json")) ??
        [];

      setAssetDataState({
        assetId,
        movieSrc: loadedMovieSrc,
        subtitlesData: loadedSubtitlesData,
        assetsReady: true,
        subtitlesDataReady: loadedSubtitlesData.length > 0,
      });
    })();
  }, [assetId]);

  return assetDataState;
}
