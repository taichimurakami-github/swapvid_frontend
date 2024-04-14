import React, { useCallback, useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";

import { PDFRenderer } from "@containers/PDFRenderer";
import {
  usePlayerActivator,
  useRelatedVideoTimeSectionParser,
  useUserDocumentViewportSyncEffect,
} from "@hooks/useDocumentPlayerEngine";
import { usePreGeneratedScrollTimeline } from "@hooks/usePreGeneratedTimeline";
import { useSequenceAnalyzer } from "@hooks/useSequenceAnalyzer";
import {
  documentPlayerActiveAtom,
  documentPlayerContainerElementRefAtom,
  documentPlayerLayoutAtom,
  documentPlayerStandbyAtom,
  documentPlayerStateAtom,
  documentPlayerWrapperElementRefAtom,
  pdfSrcAtom,
  preGeneratedScrollTimelineDataAtom,
  relatedVideoTimeSectionsAtom,
  sequenceAnalyzerEnabledAtom,
  backendServiceHostAtom,
  sequenceAnalyzerStateAtom,
  userDocumentViewportAtom,
  videoElementRefAtom,
  videoViewportAtom,
  videoCurrentTimeAtom,
} from "@/providers/jotai/store";
import { TBoundingBox } from "@/types/swapvid";
import { cvtToWHArray } from "@utils/bboxUtil";
import { VideoViewportRectangle } from "@/containers/VideoViewportRectangle";
import { sequenceAnalyzerSyncIntervalMsAtom } from "@/providers/jotai/config";

export const DocumentPlayer: React.FC<{
  playerWidth?: number;
  playerHeight?: number;
  zIndex?: number;
  standaloneModeEnabled?: boolean;
}> = ({ playerWidth, playerHeight, zIndex, standaloneModeEnabled }) => {
  const [documentPlayerActive, setDocumentPlayerActive] = useAtom(
    documentPlayerActiveAtom
  );
  const [playerStandby, setPlayerStandby] = useAtom(documentPlayerStandbyAtom);
  const [videoViewport, setVideoViewport] = useAtom(videoViewportAtom);

  const setSequenceAnalyzerState = useSetAtom(sequenceAnalyzerStateAtom);
  const setDocumentPlayerState = useSetAtom(documentPlayerStateAtom);
  const setUserDocumentViewport = useSetAtom(userDocumentViewportAtom);
  const setDocumentPlayerLayout = useSetAtom(documentPlayerLayoutAtom);
  const setDocumentPlayerWrapperElementRef = useSetAtom(
    documentPlayerWrapperElementRefAtom
  );
  const setDocumentPlayerContainerElementRef = useSetAtom(
    documentPlayerContainerElementRefAtom
  );
  const setRelatedVideoTimeSections = useSetAtom(relatedVideoTimeSectionsAtom);

  const preGeneratedScrollTimeline = useAtomValue(
    preGeneratedScrollTimelineDataAtom
  );
  const pdfSrc = useAtomValue(pdfSrcAtom);
  const sequenceAnalyzerEnabled = useAtomValue(sequenceAnalyzerEnabledAtom);
  const videoCurrentTime = useAtomValue(videoCurrentTimeAtom);
  const backendServiceHost = useAtomValue(backendServiceHostAtom);
  const sequenceAnalyzerSyncIntervalMs = useAtomValue(
    sequenceAnalyzerSyncIntervalMsAtom
  );
  const videoElementRef = useAtomValue(videoElementRefAtom);

  const documentWrapperRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const renderingScaleVideoViewport = useRef(videoViewport);

  const playerActive = documentPlayerActive || !!standaloneModeEnabled;

  /** Video viewport fetcher/getter */
  const { timeline: documentTimeline, getActiveVideoViewportFromCurrentTime } =
    usePreGeneratedScrollTimeline(preGeneratedScrollTimeline);
  const { fetchVideoViewportFromCurrentTime } =
    useSequenceAnalyzer(videoElementRef);

  const getRelatedVideoTimeSections = useRelatedVideoTimeSectionParser();

  /** State updater */
  const updatePlayerActive = useCallback(
    (v: boolean) => setDocumentPlayerActive(v),
    [setDocumentPlayerActive]
  );
  const updatePlayerStandby = useCallback(
    (v: boolean) => setPlayerStandby(v),
    [setPlayerStandby]
  );
  const updateVideoViewport = useCallback(
    (v: TBoundingBox | null) => {
      setVideoViewport(v);
    },
    [setVideoViewport]
  );
  const updateRelatedVideoTimeSections = useCallback(
    (v: TBoundingBox) => {
      const videoElementDuration = videoElementRef?.current?.duration;
      if (
        documentTimeline &&
        !!videoElementDuration &&
        videoElementDuration !== Infinity
      ) {
        const relatedVideoTimeSections = getRelatedVideoTimeSections(
          v,
          documentTimeline,
          videoElementRef?.current?.duration
        );
        setRelatedVideoTimeSections(relatedVideoTimeSections);
      }
    },
    [
      setRelatedVideoTimeSections,
      getRelatedVideoTimeSections,
      videoElementRef,
      documentTimeline,
    ]
  );
  const updateUserDocumentViewport = useCallback(
    (v: TBoundingBox | null) => {
      setUserDocumentViewport(v);

      /** Update related active timeline sections */
      v && updateRelatedVideoTimeSections(v);
    },
    [setUserDocumentViewport, updateRelatedVideoTimeSections]
  );

  const updateDocumentPlayerLayout = useCallback(() => {
    if (!documentWrapperRef.current || !documentContainerRef.current) {
      return;
    }
    setDocumentPlayerLayout({
      wrapperWidth: documentWrapperRef.current.clientWidth,
      wrapperHeight: documentWrapperRef.current.clientHeight,
      containerWidth: documentContainerRef.current.clientWidth,
      containerHeight: documentContainerRef.current.clientHeight,
    });
  }, [documentWrapperRef, documentContainerRef, setDocumentPlayerLayout]);

  /** Record documentPlayer wrapper/container clientHeight */
  useEffect(updateDocumentPlayerLayout, [
    documentWrapperRef.current?.clientWidth,
    documentContainerRef.current?.clientHeight,
    updateDocumentPlayerLayout,
  ]);

  useEffect(() => {
    setDocumentPlayerWrapperElementRef(documentWrapperRef);
    setDocumentPlayerContainerElementRef(documentContainerRef);
  }, [
    documentWrapperRef,
    documentContainerRef,
    setDocumentPlayerWrapperElementRef,
    setDocumentPlayerContainerElementRef,
  ]);

  useEffect(() => {
    /**
     * Automatically enable sequence analyzer when pre-generated timeline data is not available
     */
    !preGeneratedScrollTimeline &&
      setDocumentPlayerState((b) => ({ ...b, sequenceAnalyzerEnabled: true }));
  }, [setDocumentPlayerState, preGeneratedScrollTimeline]);

  /**
   * Get video viewport based on video.currentTime
   * (switches between pre-generated timeline data and Sequence Analyzer)
   */
  const getCurrentVideoViewport = useCallback(
    async (currentTime: number) => {
      if (sequenceAnalyzerEnabled && pdfSrc) {
        /** Use sequence analyzer to match */

        setSequenceAnalyzerState((b) => ({ ...b, running: true }));

        const assetId = pdfSrc.name.split(".")[0];

        const fetchResult = await fetchVideoViewportFromCurrentTime(
          backendServiceHost,
          assetId,
          currentTime
        );

        /**
         * if fetchResult is null,
         * 1. Failed to establish connection to sequence analyzer, or
         * 2. runtime error occurred in sequence analyzer
         */
        if (!fetchResult) return null;

        const isRunning = !(
          fetchResult.status === "ERROR" &&
          fetchResult.bodyContent.error_type === "FETCH_ERROR"
        );

        setSequenceAnalyzerState((b) => ({
          ...b,
          running: isRunning,
          pdfAvailable: fetchResult.bodyContent.document_available, // Update sequence analyzer state
          error:
            fetchResult.status === "ERROR"
              ? {
                  code: fetchResult.bodyContent.error_type,
                  message: fetchResult.bodyContent.error_message,
                }
              : b.error,
        }));

        return fetchResult.status === "OK"
          ? fetchResult.bodyContent.estimated_viewport
          : null;
      }

      /** Use pre-generated timeline data to match */
      return getActiveVideoViewportFromCurrentTime(currentTime);
    },
    [
      backendServiceHost,
      sequenceAnalyzerEnabled,
      pdfSrc,
      setSequenceAnalyzerState,
      getActiveVideoViewportFromCurrentTime,
      fetchVideoViewportFromCurrentTime,
    ]
  );

  const { handlePlayerOnScroll } = useUserDocumentViewportSyncEffect(
    documentWrapperRef,
    documentContainerRef,
    updateUserDocumentViewport
  );

  const updateDocumentScrollPositions = useCallback(
    (viewport: TBoundingBox) => {
      const wrapperElement = documentWrapperRef.current;

      if (!wrapperElement) return;

      const currentScrollLeft = wrapperElement.scrollWidth * viewport[0][0];
      const currentScrollTop = wrapperElement.scrollHeight * viewport[0][1];
      wrapperElement.scrollLeft = currentScrollLeft;
      wrapperElement.scrollTop = currentScrollTop;

      /**
       * userDocumentViewport will be updated automatically,
       * because the onScroll event handler will be triggered
       * when the scrollLeft/scrollTop is changed.
       */

      renderingScaleVideoViewport.current = viewport;
    },
    [documentWrapperRef, renderingScaleVideoViewport]
  );

  /**
   * Update the scroll position of document player
   * if the player is unactive
   *
   * at:
   * 1. every time videoViewport is changed
   * 2. every time videoCurrentTime is changed
   */
  if (videoViewport && !playerActive) {
    updateDocumentScrollPositions(videoViewport);
  }

  /**
   * Update the current video viewport
   * at every time videoCurrentTime changed
   */
  const isResponded = useRef(true);
  const prevSqaFetchTimeMs = useRef(-Infinity);
  useEffect(() => {
    if (
      isResponded.current &&
      Date.now() - prevSqaFetchTimeMs.current >= sequenceAnalyzerSyncIntervalMs
    ) {
      (async () => {
        isResponded.current = false;

        const activeVideoViewport = await getCurrentVideoViewport(
          videoCurrentTime
        );
        updatePlayerStandby(!!activeVideoViewport);
        updateVideoViewport(activeVideoViewport); // Record current viewport

        prevSqaFetchTimeMs.current = Date.now();
        isResponded.current = true;
      })();
    }
  }, [
    videoCurrentTime,
    isResponded,
    prevSqaFetchTimeMs,
    sequenceAnalyzerSyncIntervalMs,
    updatePlayerStandby,
    getCurrentVideoViewport,
    updateVideoViewport,
  ]);

  /** Adjust pdf page width to render */
  const getRenderingScalePageWidth = useCallback(
    (videoViewport: TBoundingBox | null) => {
      if (!documentContainerRef.current) {
        return 0;
      }

      const containerWidth = documentContainerRef.current.clientWidth;
      if (!videoViewport) {
        return containerWidth;
      }

      const [videoViewportWidth] = cvtToWHArray(
        videoViewport ?? [
          [0, 0],
          [1, 0],
        ]
      );

      const renderScale = videoViewportWidth > 0 ? 1 / videoViewportWidth : 1.0;

      return renderScale * containerWidth;
    },
    [documentContainerRef]
  );

  const {
    handleActivatePlayerOnScrollStart,
    handleActivatePlayerOnTextDragged,
  } = usePlayerActivator(
    documentPlayerActive,
    playerStandby,
    updatePlayerActive
  );

  const dispatchVideoElementClickEvent = useCallback(() => {
    if (videoElementRef?.current && !documentPlayerActive) {
      videoElementRef?.current.click();
    }
  }, [documentPlayerActive, videoElementRef]);

  const pageWidthToRender = standaloneModeEnabled
    ? documentWrapperRef.current?.clientWidth ?? -1
    : getRenderingScalePageWidth(renderingScaleVideoViewport.current);

  return (
    <div
      id="document_player_wrapper"
      className={`bg-white overflow-scroll ${
        standaloneModeEnabled ? "" : "scrollbar-hidden"
      }`}
      style={{
        width: playerWidth ?? "100%",
        height: playerHeight ?? "100%",
        zIndex: zIndex ?? "auto",
        transition: "opacity 0.3s ease-out",
        opacity: playerActive ? 1 : 0,
      }}
      ref={documentWrapperRef}
      onResize={updateDocumentPlayerLayout}
      onScroll={handlePlayerOnScroll}
      onWheel={
        !standaloneModeEnabled ? handleActivatePlayerOnScrollStart : undefined // Set player activator if player is not standalone mode
      }
      onTouchStart={
        !standaloneModeEnabled ? handleActivatePlayerOnScrollStart : undefined // Set player activator if player is not standalone mode
      }
      onMouseDown={
        !standaloneModeEnabled ? handleActivatePlayerOnTextDragged : undefined // Set player activator if player is not standalone mode
      }
      onClick={
        !standaloneModeEnabled ? dispatchVideoElementClickEvent : undefined // Set video element event dispatcher if player is not standalone mode
      }
    >
      {
        <div
          id="document_player_container"
          ref={documentContainerRef}
          className="w-full relative"
          onResize={(e) => {
            console.log(e);
          }}
        >
          <PDFRenderer pageWidthPx={pageWidthToRender} />
          <VideoViewportRectangle
            pageWidthPx={pageWidthToRender}
            standaloneModeEnabled={standaloneModeEnabled}
          />
        </div>
      }
    </div>
  );
};
