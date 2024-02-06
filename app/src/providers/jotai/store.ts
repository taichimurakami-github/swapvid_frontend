import {
  DOMRectLike,
  TAssetId,
  TBoundingBox,
  TDocumentTimeline,
  TInterfaceType,
  TMediaSourceObject,
  TMediaSourceType,
  TServerGeneratedScrollTimeline,
  TSubtitlesData,
} from "@/types/swapvid";
import { getJotaiStorageKey } from "@/utils/getKeyString";
import { atom } from "jotai";
import { atomWithReducer, atomWithStorage } from "jotai/utils";
import React from "react";

/**
 * Asset State
 */
export const assetLoaderStateAtom = atomWithStorage<{
  video: {
    sourceType: TMediaSourceType;
  };
  pdf: {
    sourceType: TMediaSourceType;
  };
}>(
  getJotaiStorageKey("assetLoaderState"),
  {
    video: { sourceType: "local" },
    pdf: { sourceType: "local" },
  },
  undefined,
  { getOnInit: true }
);

export const localFilePickerActiveAtom = atom(false);
export const assetIdAtom = atomWithStorage<TAssetId | null>(
  getJotaiStorageKey("assetId"),
  "SampleLectureLLM01",
  undefined,
  { getOnInit: true }
); // Set to true when !!videoSrc && !!pdfSrc === true

export const videoSrcAtom = atom<string | TMediaSourceObject | null>(null); // Set to true when video file is found.
export const pdfSrcAtom = atom<File | null>(null); // Set to true when pdf file is found.
export const subtitlesDataAtom = atom<TSubtitlesData | null>(null); // Provide parsed .srt data
export const preGeneratedScrollTimelineDataAtom =
  atom<TServerGeneratedScrollTimeline | null>(null);

// PlayerState.VideoPlayerElement
export const videoPlayerLayoutAtom = atom({ width: 0, height: 0 });
export const videoMetadataAtom = atom<{
  resolution: [number, number];
  duration: number;
  live: boolean;
}>({
  resolution: [0, 0],
  duration: 0,
  live: false,
});
export const videoElementRefAtom =
  atom<null | React.RefObject<HTMLVideoElement>>(null);

export const videoElementStateAtom = atom({
  paused: false,
  loaded: false,
  volume: 0, // media volume(0~1)
});

// PlayerState.DocumentPlayerElement
export const documentPlayerLayoutAtom = atom({
  wrapperWidth: 0,
  wrapperHeight: 0,
  containerWidth: 0, // Same as documentWrapper.scrollWidth
  containerHeight: 0, // Same as documentWrapper.scrollHeight
});
export const documentPlayerStateAtom = atom({
  sequenceAnalyzerEnabled: false,
});
export const documentPlayerContainerElementRefAtom =
  atom<null | React.RefObject<HTMLDivElement>>(null);
export const documentPlayerWrapperElementRefAtom =
  atom<null | React.RefObject<HTMLDivElement>>(null);

export const documentPlayerActiveAtom = atom(false);
export const documentPlayerStandbyAtom = atom(false);
export const documentOverviewActiveAtom = atom(false);
export const pipVideoWindowActiveAtom = atom(true);
// export const documentPlayerContainerRef =
//   atom<null | React.MutableRefObject<HTMLDivElement>>(null); // A container of rendered PDF element
// export const documentPlayerWrapperRef = atom<null | HTMLDivElement>(null); // A wrapper of PDF element container sized to videoPlayerRenderedRes.

// PlayerState.ContentLocationSync
export const userDocumentViewportAtom = atom<TBoundingBox | null>(null);
export const videoViewportAtom = atom<TBoundingBox | null>(null);
export const videoCurrentTimeAtom = atom(0);
export const scrollTimelineDataAtom = atom<TDocumentTimeline | null>(null);
export const relatedVideoTimeSectionsAtom = atom<[number, number, number][]>(
  []
);

// PlayerState.SubtitlesPlayer
export const subtitlesActiveAtom = atom(false);

// PlayerState.PdfRenderer
export const pdfRendererStateAtom = atom({
  loaded: false,
  pageLength: 0,
  totalHeight: 0,
});
export const pdfPageStateAtom = atom({
  width: 0,
  height: 0,
});

// PlayerState.RootPlayerConfig
export const swapvidInterfaceTypeAtom = atomWithStorage<TInterfaceType>(
  getJotaiStorageKey("interfaceType"),
  "combined",
  undefined,
  { getOnInit: true }
);
export const appMenuActiveAtom = atom(false);

// SequenceAnalyzer.Analyzer
export const sequenceAnalyzerEnabledAtom = atomWithStorage(
  getJotaiStorageKey("sequenceAnalyzerEnabled"),
  false,
  undefined,
  { getOnInit: true }
);

export const backendServiceHostAtom = atomWithStorage(
  getJotaiStorageKey("backendServiceHostAtom"),
  "127.0.0.1",
  undefined,
  { getOnInit: true }
);
export const sequenceAnalyzerStateAtom = atom<{
  listening: boolean;
  running: boolean;
  pdfAvailable: boolean;
  error: null | {
    code: string;
    message: string;
  };
}>({
  listening: false, // Whether the sequence analyzer sends the response or not.
  running: false, // True when the sequence analyzer is analyzing client's response.
  pdfAvailable: false, //  Whether the pdf file of active asset is available or not.
  error: null, // Infomation about current error response.
});

// SequenceAnalyzer.Services
export const backendPdfAnalyzerApiStateAtom = atom<null | {
  progress: number;
}>(null);

// SwapVid Desktop
export const swapvidDesktopEnabledAtom = atomWithStorage(
  getJotaiStorageKey("swapvidDesktopEnabled"),
  false,
  undefined,
  { getOnInit: true }
);

export const userCroppedAreaAtom = atom<{
  raw: DOMRectLike;
  videoScale: DOMRectLike;
} | null>(null);

export const videoCropperActiveAtom = atom(false);
export const pdfUploaderActiveAtom = atom(false);

export type AppModalElementAtomReducerActions =
  | {
      type: "close";
    }
  | {
      type: "open";
      payload: React.ReactElement;
    };
export const appModalElementAtom = atomWithReducer<
  null | React.ReactElement,
  AppModalElementAtomReducerActions
>(null, (value, action) => {
  if (!action) throw new Error("Action is not defined.");

  switch (action.type) {
    case "close":
      return null;
    case "open":
      return action.payload;
  }
});
