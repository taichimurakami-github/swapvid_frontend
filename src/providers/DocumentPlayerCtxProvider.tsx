import React, {
  createContext,
  PropsWithChildren,
  useReducer,
  useState,
} from "react";
import {
  TAssetId,
  TBoundingBox,
  TDocumentTimeline,
  TInterfaceMode,
} from "@/types/swapvid";
import {
  documentPlayerStateReducer,
  documentPlayerStateReducerActions,
} from "@/providers/reducers/documentPlayerState";

export type TDocumentPlayerState = {
  mode: TInterfaceMode;
  assetId: TAssetId;
  loaded: boolean;
  active: boolean;
  standby: boolean;
  baseImgSrc: string;
  pdfSrc: string;
  wrapperScrollHeight: number;
  wrapperWindowHeight: number;
  playerElement: HTMLElement | null;
  unableScrollTo: number;
  gapBetweenImagesPx: number;
  type: "document" | "slide";
  timelineData: TDocumentTimeline;
  documentAvailable: boolean;
};

export type TDocumentPlayerStateCtx = TDocumentPlayerState | null;
export const DocumentPlayerStateCtx =
  createContext<TDocumentPlayerStateCtx>(null);
export type TDispatchDocumentPlayerStateCtx =
  React.Dispatch<documentPlayerStateReducerActions> | null;
export const DispatchDocumentPlayerStateCtx =
  createContext<TDispatchDocumentPlayerStateCtx>(null);

export type TVideoViewport = TBoundingBox | null;
export type TVideoViewportCtx = TVideoViewport;
export const VideoViewportCtx = createContext<TVideoViewportCtx>(null);
export type TSetVideoViewportCtx = React.Dispatch<
  React.SetStateAction<TVideoViewport>
> | null;
export const SetVideoViewportCtx = createContext<TSetVideoViewportCtx>(null);

export type TDocumentViewport = TBoundingBox | null;
export type TDocumentViewportCtx = TDocumentViewport;
export const DocumentViewportCtx = createContext<TDocumentViewportCtx>(null);
export type TSetDocumentViewportCtx = React.Dispatch<
  React.SetStateAction<TDocumentViewport>
> | null;
export const SetDocumentViewportCtx = createContext<TSetVideoViewportCtx>(null);

export type TSeekbarActiveTimes = [number, number, number][];
export type TSeekbarActiveTimesCtx = TSeekbarActiveTimes | null;
export const SeekbarActiveTimesCtx = createContext<TSeekbarActiveTimesCtx>([]);
export type TSetSeekbarActiveTimesCtx = React.Dispatch<
  React.SetStateAction<TSeekbarActiveTimes>
> | null;
export const SetSeekbarActiveTimesCtx =
  createContext<TSetSeekbarActiveTimesCtx>(null);

export default function DocumentPlayerCtxProvider(
  props: PropsWithChildren<{
    playerMode: TInterfaceMode;
    assetId: TAssetId;
  }>
) {
  const [documentPlayerState, dispatchDocumentPlayerState] = useReducer(
    documentPlayerStateReducer,
    {
      assetId: props.assetId,
      mode: props.playerMode,
      type:
        props.assetId === "CHI2021Fujita" ||
        props.assetId === "IEEEVR2022Ogawa" ||
        props.assetId === "IEEEVR2022Hoshikawa"
          ? "slide"
          : "document",
      loaded: false,
      /**
       * TODO:
       * playerActiveを，どの経路からアクティブにしたのかで判断したい
       * 情報を格納するため新たな変数を追加する
       */
      active: false,
      standby: false,
      baseImgSrc: "",
      pdfSrc: "",
      wrapperScrollHeight: 0,
      wrapperWindowHeight: 0,
      playerElement: null,
      unableScrollTo: 0,
      timelineData: [],
      gapBetweenImagesPx: 0,
      documentAvailable: false,
    }
  );

  const [videoViewport, setVideoViewport] = useState<TVideoViewport>(null);
  const [documentViewport, setDocumentViewport] =
    useState<TDocumentViewport>(null);

  const [seekbarActiveTimes, setSeekbarActiveTimes] =
    useState<TSeekbarActiveTimes>([]);

  return (
    <DispatchDocumentPlayerStateCtx.Provider
      value={dispatchDocumentPlayerState}
    >
      <DocumentPlayerStateCtx.Provider value={documentPlayerState}>
        <SetDocumentViewportCtx.Provider value={setDocumentViewport}>
          <DocumentViewportCtx.Provider value={documentViewport}>
            <SetVideoViewportCtx.Provider value={setVideoViewport}>
              <VideoViewportCtx.Provider value={videoViewport}>
                <SetSeekbarActiveTimesCtx.Provider
                  value={setSeekbarActiveTimes}
                >
                  <SeekbarActiveTimesCtx.Provider value={seekbarActiveTimes}>
                    {props.children}
                  </SeekbarActiveTimesCtx.Provider>
                </SetSeekbarActiveTimesCtx.Provider>
              </VideoViewportCtx.Provider>
            </SetVideoViewportCtx.Provider>
          </DocumentViewportCtx.Provider>
        </SetDocumentViewportCtx.Provider>
      </DocumentPlayerStateCtx.Provider>
    </DispatchDocumentPlayerStateCtx.Provider>
  );
}
