import {
  TBoundingBox,
  TDocumentTimeline,
  TInterfaceMode,
  TServerGeneratedScrollTimeline,
} from "@/types/swapvid";
import React, { useCallback, useEffect, useState } from "react";
import { useDocumentScrollTimeline } from "./usePreGeneratedTimeline";
import { calcBboxArea, cvtToTLWHArray } from "@/utils/bboxUtil";
import { calcRectCollision } from "@/utils/collision";
import {
  TDispatchDocumentPlayerStateCtx,
  TDocumentPlayerElementCtx,
} from "@/providers/useContext/DocumentPlayerCtxProvider";
import {
  SetCurrentVideoViewportCtx,
  TSetCurrentVideoViewportCtx,
} from "@/providers/useContext/ViewportCtxProvider";
import {
  useDispatchDocumentPlayerStateCtx,
  useDispatchPdfPageStateCtx,
  useDocumentPlayerElementCtx,
  useSetCurrentVideoViewportCtx,
} from "./useContextConsumer";
import { useVideoCurrentTimeEffect } from "./useVideoCurrenttime";
import { TDispatchPdfPageStateCtx } from "@/providers/useContext/PdfRendererCtx";

export default function useDocumentPlayerCore(mode: TInterfaceMode) {
  const [documentPlayerState, setDocumentPlayerState] = useState<{
    mode: TInterfaceMode;
    standby: boolean;
    active: boolean;
    unableScrollTo: number;
    activeTimes: [number, number][];
  }>({
    mode: mode,
    standby: false,
    active: false,
    unableScrollTo: 0,
    activeTimes: [],
  });

  const handleDocumentPlayerActiveTimes = (value: [number, number][]) =>
    setDocumentPlayerState((s) => ({ ...s, activeTimes: value }));

  const handleDocumentPlayerActive = (value: boolean) => {
    console.log(value);
    setDocumentPlayerState((s) => ({ ...s, active: value }));
  };

  const handleDocumentPlayerStandby = (value: boolean) =>
    setDocumentPlayerState((s) => ({ ...s, standby: value }));

  return {
    documentPlayerState,
    handleDocumentPlayerActive,
    handleDocumentPlayerStandby,
    handleDocumentPlayerActiveTimes,
  };
}

/**
 * Player core functions about video time update event
 * @returns
 */
export const usePlayerCoreOnVideoTimeUpdate = () => {
  return;
};

/**
 * Player core functions about user interaction
 * @returns
 */
export const usePlayerCoreOnUserInteraction = () => {
  return;
};

// export const useSequenceAnalyzerTimeline = (timeline: TDocumentTimeline) => {};

/**
 * Player core functions about document sqa result timeline data
 * @returns
 */
export const usePlayerCoreSqaTimeline = (
  scrollTimeline: TServerGeneratedScrollTimeline
) => {
  const { timeline } = useDocumentScrollTimeline(
    scrollTimeline || {
      media_metadata: [0, 0, 0, 0],
      document_metadata: [0, 0],
      tl_document_scrollY: [],
    }
  );

  const getActiveTlSectionFromPlaytime = useCallback(
    (time: number): TDocumentTimeline[0] | null => {
      const currentSection =
        timeline.find((v) => v.time[0] <= time && time < v.time[1]) ?? null;

      return currentSection;
    },
    [timeline]
  );

  return {
    getActiveTlSectionFromPlaytime,
  };
};

export const useCommons = (
  playerActive: boolean,
  playerStandby: boolean,
  forceToActivatePlayerByUserManipulation: boolean
) => {
  const dispatchDocumentPlayerState = useDispatchDocumentPlayerStateCtx();
  const activatePlayer = useCallback(() => {
    if (!dispatchDocumentPlayerState) return;

    const readyForActivation =
      forceToActivatePlayerByUserManipulation ||
      (!playerActive && playerStandby);

    readyForActivation &&
      dispatchDocumentPlayerState({
        type: "update_active",
        value: true,
      });
  }, [
    forceToActivatePlayerByUserManipulation,
    dispatchDocumentPlayerState,
    playerActive,
    playerStandby,
  ]);

  return { activatePlayer };
};

export const usePlayerInitializer = (args: {
  documentBaseImageSrc: string;
  dispatchDocumentPlayerState: TDispatchDocumentPlayerStateCtx;
}) => {
  const elems = useDocumentPlayerElementCtx();

  useEffect(() => {
    if (
      args.dispatchDocumentPlayerState &&
      elems?.containerRef.current &&
      elems?.wrapperRef.current
    ) {
      args.dispatchDocumentPlayerState({
        type: "update",
        value: {
          baseImgSrc: args.documentBaseImageSrc,
          scrollHeight: elems.containerRef.current.clientHeight,
          playerHeight: elems.wrapperRef.current.clientHeight,
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    args.documentBaseImageSrc,
    args.dispatchDocumentPlayerState,
    useDocumentPlayerElementCtx,
  ]);
};

export const useDocumentTimeline = (
  sqaResult: TServerGeneratedScrollTimeline
) => {
  const { timeline } = useDocumentScrollTimeline(
    sqaResult || {
      media_metadata: [0, 0, 0, 0],
      document_metadata: [0, 0],
      tl_document_scrollY: [],
    }
  );

  return timeline;
};

const getActiveTlSectionFromPlaytime = (
  time: number,
  timeline: TDocumentTimeline
): TDocumentTimeline[number] | null => {
  const currentSection =
    timeline.find((v) => v.time[0] <= time && time < v.time[1]) ?? null;

  return currentSection;
};

const updateCurrentVideoViewportCtx = (
  setter: TSetCurrentVideoViewportCtx,
  currentVideoViewport: TBoundingBox
) => {
  setter && setter(currentVideoViewport);
};

export const useWrapperScrollAmountAdjustor = (args: {
  documentPlayerElements: TDocumentPlayerElementCtx;
  videoElement: HTMLVideoElement;
  timeline: TDocumentTimeline;
  currentTime: number;
  playerActive: boolean;
  dispatchDocumentPlayerState: TDispatchDocumentPlayerStateCtx;
  dispatchPdfPageState: TDispatchPdfPageStateCtx;
  setCurrentVideoViewportCtx: TSetCurrentVideoViewportCtx;
  setVideoViewport: TSetCurrentVideoViewportCtx;
  setActiveScrollTl: (v: TDocumentTimeline[0] | null) => void;
  // documentContainerRef: React.RefObject<HTMLDivElement>,
  // documentWrapperRef: React.RefObject<HTMLDivElement>
}) => {
  const elems = args.documentPlayerElements;

  const getActiveTlSectionFromPlaytime = useCallback(
    (time: number): TDocumentTimeline[0] | null => {
      const currentSection =
        args.timeline.find((v) => v.time[0] <= time && time < v.time[1]) ??
        null;

      return currentSection;
    },
    [args.timeline]
  );

  /**
   * DocPlayer state updation hooks (Video Current Time driven)
   * 1. Get active timeline section
   * 2. Calculate new document states
   * 3. Dispatch changes depending on specific conditions
   */
  useVideoCurrentTimeEffect(args.videoElement, (currentTime: number) => {
    if (
      args.dispatchDocumentPlayerState &&
      args.setVideoViewport &&
      elems?.wrapperRef.current &&
      elems?.containerRef.current
    ) {
      const containerElem = elems.containerRef.current;
      const wrapperElem = elems.wrapperRef.current;
      // const documentWidth = containerElem.clientWidth;
      // const documentHeight = containerElem.clientHeight;

      const activeTlSection = getActiveTlSectionFromPlaytime(currentTime);

      args.setActiveScrollTl(activeTlSection);
      args.setVideoViewport(activeTlSection?.videoViewport ?? null);

      // Failed to found active section from scroll timeline
      if (
        !activeTlSection ||
        !activeTlSection.videoViewport // Found activeTlSection but section doesn't record onFocusArea
      ) {
        return args.dispatchDocumentPlayerState({
          type: "update_standby",
          value: false,
        });
      }

      args.dispatchDocumentPlayerState({
        type: "update_standby",
        value: !!activeTlSection && !!activeTlSection.videoViewport,
      });

      const currentVideoViewport = activeTlSection.videoViewport;

      args.setCurrentVideoViewportCtx?.call &&
        args.setCurrentVideoViewportCtx(currentVideoViewport);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [top, left, width, _height] = cvtToTLWHArray(currentVideoViewport);

      const renderScale = width > 0 ? 1 / width : 1.0;

      // Set document render styles when player is unactive
      // (to minimize performance issue)
      if (!args.playerActive && args.dispatchPdfPageState) {
        args.dispatchPdfPageState({
          type: "update",
          value: {
            baseWidth: args.videoElement.clientWidth,
            renderScale,
          },
        });
      }

      // Syncronize document player scroll position
      if (!args.playerActive) {
        wrapperElem.scrollTop = documentHeight * top;
        wrapperElem.scrollLeft = documentWidth * left;
      }

      // Update activity states
      // props.enableInvidActivitiesReenactment &&
      //   updateAcitvityState(currentTime);
    }
  });
};

export const useUserScrollEvent = (timeline: TDocumentTimeline) => {
  const getPlaytimeFromCurrentDocumentViewport = useCallback(
    (
      currentDocumentViewport: TBoundingBox,
      videoDuration: number
    ): [number, number, number][] => {
      const viewportArea = calcBboxArea(currentDocumentViewport);

      return timeline
        .map((v) => {
          if (!v.videoViewport) return null; // 資料が映り込んでいないシーンは対象から除外

          const collidedRect = calcRectCollision(
            currentDocumentViewport,
            v.videoViewport
          );

          if (!collidedRect) return null; //ビューポートと衝突していない区間はハイライトしない

          const collidedArea = calcBboxArea(collidedRect);
          const videoArea = calcBboxArea(v.videoViewport);

          const areaRatioCollidedPerViewport =
            collidedArea / Math.min(videoArea, viewportArea); // parallel viewのように，doc viewport > video viewportの場合に対応

          const sectionTimeRange =
            videoDuration < v.time[1] //time[1]がInfinityの場合，ビデオの終了まで位置が持続するとみなす
              ? [v.time[0], videoDuration] //time[start, videoEnd]に置換
              : v.time; //time[start, end] をそのまま代入

          return [...sectionTimeRange, areaRatioCollidedPerViewport];
        })
        .filter((v) => !!v) as [number, number, number][]; //nullを除く
    },
    [timeline]
  );

  return { getPlaytimeFromCurrentDocumentViewport };
};
