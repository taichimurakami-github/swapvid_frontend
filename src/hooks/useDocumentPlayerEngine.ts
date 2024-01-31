import { TBoundingBox, TDocumentTimeline } from "@/types/swapvid";
import { calcBboxArea } from "@/utils/bboxUtil";
import { calcRectCollision } from "@/utils/collision";
import React, { useCallback, useRef } from "react";
import { useVideoCurrentTimeEffect } from "@/hooks/useVideoCurrenttime";

export const useRelatedVideoTimeSectionParser = () => {
  /**
   * Get active timeline section from user's current document viewport.
   * Works only when player is not in live mode.
   */
  return useCallback(
    (
      currentDocumentViewport: TBoundingBox,
      timeline: TDocumentTimeline,
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

          const sectionTimeRange =
            videoDuration < v.time[1] //time[1]がInfinityの場合，ビデオの終了まで位置が持続するとみなす
              ? [v.time[0], videoDuration] //time[start, videoEnd]に置換
              : v.time; //time[start, end] をそのまま代入

          /** FIXME: Caluclated incorrectly when user document viewport is large in portrait */
          const areaRatioCollidedPerViewport = collidedArea / viewportArea;

          return [...sectionTimeRange, areaRatioCollidedPerViewport];
        })
        .filter((v) => !!v) as [number, number, number][]; //nullを除く
    },
    []
  );
};

export const usePlayerCoreFunction = () => {
  const dispatchClickEventToVideoElement = useCallback(
    (
      videoElement: HTMLVideoElement,
      currentPlayerActive: boolean,
      currentPlayerStandby: boolean,
      forceToDispatchClickEventToVideoElementOnDocumentPlayer?: boolean,
      disableDispatchVideoElementClickEvent?: boolean
    ) => {
      if (disableDispatchVideoElementClickEvent) {
        return;
      }

      if (
        (currentPlayerActive &&
          forceToDispatchClickEventToVideoElementOnDocumentPlayer) ||
        !currentPlayerStandby
      ) {
        videoElement.click();
      }
    },
    []
  );

  return {
    dispatchClickEventToVideoElement,
  };
};

export const usePlayerActivator = (
  playerActive: boolean,
  playerStandby: boolean,
  updateDocumentPlayerActive: (v: boolean) => void,
  forceToActivatePlayerByUserManipulation?: boolean
) => {
  const handleActivatePlayerOnScrollStart = useCallback(() => {
    if (!updateDocumentPlayerActive || playerActive) return;

    const readyForActivation =
      forceToActivatePlayerByUserManipulation ||
      (!playerActive && playerStandby);

    readyForActivation && updateDocumentPlayerActive(true);
  }, [
    playerActive,
    playerStandby,
    updateDocumentPlayerActive,
    forceToActivatePlayerByUserManipulation,
  ]);

  const handleActivatePlayerOnTextDragged = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!playerActive && updateDocumentPlayerActive) {
        const onClickNode = e.nativeEvent.composedPath()[0] as HTMLElement;
        const isTextClicked =
          onClickNode.nodeName === "SPAN" && !!onClickNode.innerText;

        isTextClicked && updateDocumentPlayerActive(true);
      }
    },
    [playerActive, updateDocumentPlayerActive]
  );

  return {
    handleActivatePlayerOnScrollStart,
    handleActivatePlayerOnTextDragged,
  };
};

export const useUserDocumentViewportSyncEffect = (
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  updateUserDocumentViewport: (viewport: TBoundingBox) => void,
  interval_ms = 50
) => {
  const previousUpdatedTimeRef = useRef<number>(0);

  const _shouldUpdate = useCallback((currentTime_ms: number) => {
    return currentTime_ms - previousUpdatedTimeRef.current > interval_ms;
  }, []);

  const handlePlayerOnScroll = useCallback(
    () => {
      const now = Date.now();
      if (!_shouldUpdate(now)) return;
      previousUpdatedTimeRef.current = now;

      const containerElem = containerRef.current;
      const wrapperElem = wrapperRef.current;

      if (wrapperElem && containerElem) {
        const documentWidth = containerElem.clientWidth;
        const documentHeight = containerElem.clientHeight;
        const playerViewportWidth = wrapperElem.clientWidth;
        const playerViewportHeight = wrapperElem.clientHeight;

        const currDocLeft = wrapperElem.scrollLeft / documentWidth;
        const currDocTop = wrapperElem.scrollTop / documentHeight;
        const currDocWidth = playerViewportWidth / documentWidth;
        const currDocHeight = playerViewportHeight / documentHeight;

        const documentViewport: [[number, number], [number, number]] = [
          [currDocLeft, currDocTop],
          [currDocLeft + currDocWidth, currDocTop + currDocHeight],
        ];

        updateUserDocumentViewport(documentViewport); // Dispatch current user's document viewport
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateUserDocumentViewport, previousUpdatedTimeRef.current]
  );
  return { handlePlayerOnScroll };
};

export const useVideoViewportSyncEffect = (
  videoElementRef: React.RefObject<HTMLVideoElement> | null,
  getCurrentVideoViewport: (t: number) => Promise<null | TBoundingBox>,
  updateDocumentPlayerStandby: (v: boolean) => void,
  updateVideoViewport: (v: TBoundingBox | null) => void
) => {
  useVideoCurrentTimeEffect(videoElementRef, async (currentTime: number) => {
    if (!updateDocumentPlayerStandby || !updateVideoViewport) {
      return;
    }

    const activeVideoViewport = await getCurrentVideoViewport(currentTime);
    updateDocumentPlayerStandby(!!activeVideoViewport);

    // Failed to found active section from scroll timeline
    if (!activeVideoViewport) {
      return;
    }

    /** Record current viewport */
    updateVideoViewport(activeVideoViewport);
  });
};
