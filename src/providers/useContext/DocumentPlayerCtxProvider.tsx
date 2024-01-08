import React, {
  createContext,
  PropsWithChildren,
  useReducer,
  useRef,
} from "react";
import { TAssetId, TDocumentTimeline, TInterfaceMode } from "@/types/swapvid";
import {
  documentPlayerStateReducer,
  TDocumentPlayerStateReducerActions,
} from "@/providers/useContext/reducers/documentPlayerState";

export type TDocumentPlayerState = {
  mode: TInterfaceMode;
  loaded: boolean;
  active: boolean;
  standby: boolean;
  baseImgSrc: string;
  pdfSrc: string;
  scrollHeight: number;
  scrollWidth: number;
  playerHeight: number;
  playerWidth: number;
  unableScrollTo: number;
  timelineData: TDocumentTimeline;
  documentAvailable: boolean;
};

export type TDocumentPlayerStateCtx = TDocumentPlayerState | null;
export const DocumentPlayerStateCtx =
  createContext<TDocumentPlayerStateCtx>(null);
export type TDispatchDocumentPlayerStateCtx =
  React.Dispatch<TDocumentPlayerStateReducerActions> | null;
export const DispatchDocumentPlayerStateCtx =
  createContext<TDispatchDocumentPlayerStateCtx>(null);

export type TDocumentPlayerWrapperElement = HTMLDivElement;
export type TDocumentPlayerContainerElement = HTMLDivElement;
export type TDocumentPlayerElement = {
  wrapperRef: React.RefObject<TDocumentPlayerWrapperElement>;
  containerRef: React.RefObject<TDocumentPlayerContainerElement>;
};

export type TDocumentPlayerElementCtx = TDocumentPlayerElement | null;
export const DocumentPlayerElementCtx =
  createContext<TDocumentPlayerElementCtx>(null);

export default function DocumentPlayerCtxProvider(
  props: PropsWithChildren<{
    playerMode: TInterfaceMode;
    assetId: TAssetId;
  }>
) {
  const [documentPlayerState, dispatchDocumentPlayerState] = useReducer(
    documentPlayerStateReducer,
    {
      mode: props.playerMode,
      loaded: false,
      /**
       * TODO:
       * playerActiveを，どの経路からアクティブにしたのかで判断したい
       * 情報を格納するため新たな変数を追加する
       */
      active: false, // state changing triggered by user manipulation
      standby: false, // state changing triggered by sqa
      documentAvailable: false, // state changing triggered by sqa
      baseImgSrc: "",
      pdfSrc: "",
      scrollWidth: 0,
      scrollHeight: 0,
      playerWidth: 0,
      playerHeight: 0,
      unableScrollTo: 0,
      timelineData: [],
    }
  );

  const playerWrapperRef = useRef<TDocumentPlayerWrapperElement>(null);
  const playerContainerRef = useRef<TDocumentPlayerContainerElement>(null);

  return (
    <DispatchDocumentPlayerStateCtx.Provider
      value={dispatchDocumentPlayerState}
    >
      <DocumentPlayerStateCtx.Provider value={documentPlayerState}>
        <DocumentPlayerElementCtx.Provider
          value={{
            wrapperRef: playerWrapperRef,
            containerRef: playerContainerRef,
          }}
        >
          {props.children}
        </DocumentPlayerElementCtx.Provider>
      </DocumentPlayerStateCtx.Provider>
    </DispatchDocumentPlayerStateCtx.Provider>
  );
}
