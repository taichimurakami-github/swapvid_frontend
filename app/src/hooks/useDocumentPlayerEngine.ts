import { TBoundingBox, TDocumentTimeline } from "@/types/swapvid";
import { calcBboxArea } from "@/utils/bboxUtil";
import { calcRectCollision } from "@/utils/collision";
import React, { useCallback, useRef } from "react";

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
  updateUserDocumentViewport: (viewport: TBoundingBox) => void
) => {
  const handlePlayerOnScroll = useCallback(() => {
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
  }, [containerRef, wrapperRef, updateUserDocumentViewport]);
  return { handlePlayerOnScroll };
};
