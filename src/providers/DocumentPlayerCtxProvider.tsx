import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import {
  TAssetId,
  TBoundingBox,
  TDocumentTimeline,
  TInterfaceMode,
} from "@/@types/types";

export type TDocumentPlayerStateCtx = {
  mode: TInterfaceMode;
  assetId: TAssetId;
  loaded: boolean;
  active: boolean;
  standby: boolean;
  activeTimes: [number, number][];
  baseImgSrc: string;
  pdfSrc: string;
  wrapperScrollHeight: number;
  wrapperWindowHeight: number;
  videoOnFocusArea: TBoundingBox | null;
  documentOnFocusArea: TBoundingBox;
  playerElement: HTMLElement | null;
  unableScrollTo: number;
  gapBetweenImagesPx: number;
  type: "document" | "slide";
  timelineData: TDocumentTimeline;
};

export type TDocumentPlayerSetterArguments = Partial<TDocumentPlayerStateCtx>;

export type TSeTDocumentPlayerStateCtx = {
  setDocumentPlayerStateValues: (
    value?: TDocumentPlayerSetterArguments
  ) => void;
  // getOnFocusTimeline: () => TContentTimeline | undefined;
};

//@ts-ignore
export const DocumentPlayerStateCtx = createContext<TDocumentPlayerStateCtx>();
export const SetDocumentPlayerStateCtx =
  //@ts-ignore
  createContext<TSeTDocumentPlayerStateCtx>({});

export default function DocumentPlayerCtxProvider(
  props: PropsWithChildren<{
    playerMode: TInterfaceMode;
    assetId: TAssetId;
  }>
) {
  const [documentPlayerState, setDocumentPlayerState] =
    useState<TDocumentPlayerStateCtx>({
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
      activeTimes: [],
      baseImgSrc: "",
      pdfSrc: "",
      wrapperScrollHeight: 0,
      wrapperWindowHeight: 0,
      videoOnFocusArea: [
        [0.0, 0.0],
        [0.0, 0.0],
      ],
      documentOnFocusArea: [
        [0.0, 0.0],
        [0.0, 0.0],
      ],
      playerElement: null,
      unableScrollTo: 0,
      timelineData: [],
      gapBetweenImagesPx: 0,
    });

  const setDocumentPlayerStateValues = useCallback(
    (value?: TDocumentPlayerSetterArguments) => {
      setDocumentPlayerState((b) => ({
        ...b,
        ...value,
      }));
    },
    []
  );

  return (
    <SetDocumentPlayerStateCtx.Provider
      value={{ setDocumentPlayerStateValues }}
    >
      <DocumentPlayerStateCtx.Provider value={documentPlayerState}>
        {props.children}
      </DocumentPlayerStateCtx.Provider>
    </SetDocumentPlayerStateCtx.Provider>
  );
}
