import React, { useCallback, useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";

import { PDFRenderer } from "@containers/PDFRenderer";
import {
  usePlayerActivator,
  useRelatedVideoTimeSectionParser,
  useUserDocumentViewportSyncEffect,
  useVideoViewportSyncEffect,
} from "@hooks/useDocumentPlayerEngine";
import { usePreGeneratedScrollTimeline } from "@hooks/usePreGeneratedTimeline";
import { useSequenceAnalyzer } from "@hooks/useSequenceAnalyzer";
import {
  assetIdAtom,
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
  sequenceAnalyzerEndpointURLAtom,
  sequenceAnalyzerStateAtom,
  userDocumentViewportAtom,
  videoElementRefAtom,
  videoViewportAtom,
} from "@/providers/jotai/store";
import { TBoundingBox } from "@/types/swapvid";
import { cvtToWHArray } from "@utils/bboxUtil";
import { VideoViewportRectangle } from "@/containers/VideoViewportRectangle";

export const DocumentPlayer: React.FC<{
  playerWidth?: number;
  playerHeight?: number;
  zIndex?: number;
  standaloneModeEnabled?: boolean;
}> = ({ playerWidth, playerHeight, zIndex, standaloneModeEnabled }) => {
  const videoViewport = useAtomValue(videoViewportAtom);
  const preGeneratedScrollTimeline = useAtomValue(
    preGeneratedScrollTimelineDataAtom
  );
  const pdfSrc = useAtomValue(pdfSrcAtom);
  const assetId = useAtomValue(assetIdAtom);
  const sequenceAnalyzerEnabled = useAtomValue(sequenceAnalyzerEnabledAtom);
  const sequenceAnalyzerEndpointURL = useAtomValue(
    sequenceAnalyzerEndpointURLAtom
  );
  const [documentPlayerActive, setDocumentPlayerActive] = useAtom(
    documentPlayerActiveAtom
  );
  const [playerStandby, setPlayerStandby] = useAtom(documentPlayerStandbyAtom);
  const setDocumentPlayerState = useSetAtom(documentPlayerStateAtom);
  const setVideoViewport = useSetAtom(videoViewportAtom);
  const setUserDocumentViewport = useSetAtom(userDocumentViewportAtom);
  const setDocumentPlayerLayout = useSetAtom(documentPlayerLayoutAtom);
  const setDocumentPlayerWrapperElementRef = useSetAtom(
    documentPlayerWrapperElementRefAtom
  );
  const setDocumentPlayerContainerElementRef = useSetAtom(
    documentPlayerContainerElementRefAtom
  );
  const setRelatedVideoTimeSections = useSetAtom(relatedVideoTimeSectionsAtom);
  const setSequenceAnalyzerState = useSetAtom(sequenceAnalyzerStateAtom);

  const videoElementRef = useAtomValue(videoElementRefAtom);
  const documentWrapperRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const renderingScaleVideoViewport = useRef(videoViewport);

  const playerActive = documentPlayerActive || standaloneModeEnabled;

  /** Video viewport fetcher/getter */
  const {
    timeline: scrollTimelineData,
    getActiveVideoViewportFromCurrentTime,
  } = usePreGeneratedScrollTimeline(preGeneratedScrollTimeline);
  const { fetchVideoViewportFromCurrentTime } = useSequenceAnalyzer(
    assetId,
    videoElementRef
  );

  const getRelatedVideoTimeSections = useRelatedVideoTimeSectionParser();
  const { timeline: documentTimeline } = usePreGeneratedScrollTimeline(
    preGeneratedScrollTimeline
  );

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

      if (!playerActive) {
        renderingScaleVideoViewport.current = v; // Update renderingScale video viewport to re-render PDFRenderer, while player is unactive.
      }
    },
    [setVideoViewport, playerActive]
  );
  const updateRelatedVideoTimeSections = useCallback(
    (v: TBoundingBox) => {
      if (documentTimeline && videoElementRef?.current?.duration) {
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
  const updateDocumentScrollPositions = useCallback(
    (viewport: TBoundingBox) => {
      if (!documentWrapperRef.current || documentPlayerActive) return;

      const currentScrollLeft =
        documentWrapperRef.current.scrollWidth * viewport[0][0];
      const currentScrollTop =
        documentWrapperRef.current.scrollHeight * viewport[0][1];
      documentWrapperRef.current.scrollLeft = currentScrollLeft;
      documentWrapperRef.current.scrollTop = currentScrollTop;

      /**
       * userDocumentViewport will be updated automatically,
       * because the onScroll event handler will be triggered
       * when the scrollLeft/scrollTop is changed.
       */
    },
    [documentWrapperRef, documentPlayerActive]
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
    !preGeneratedScrollTimeline &&
      setDocumentPlayerState((b) => ({ ...b, sequenceAnalyzerEnabled: true }));
  }, [setDocumentPlayerState, preGeneratedScrollTimeline]);

  /**
   * Get video viewport based on video.currentTime
   * (switches between pre-generated timeline data and Sequence Analyzer)
   */
  const getCurrentVideoViewport = useCallback(
    async (currentTime: number) => {
      const preGeneratedScrollTimelineExists = scrollTimelineData.length > 0;

      if (!preGeneratedScrollTimelineExists || sequenceAnalyzerEnabled) {
        /** Use sequence analyzer to match */

        setSequenceAnalyzerState((b) => ({ ...b, running: true }));

        const fetchResult = await fetchVideoViewportFromCurrentTime(
          sequenceAnalyzerEndpointURL,
          currentTime
        );

        /**
         * if fetchResult is null,
         * 1. Failed to establish connection to sequence analyzer, or
         * 2. runtime error occurred in sequence analyzer
         */
        if (!fetchResult) return null;

        setSequenceAnalyzerState((b) => ({
          ...b,
          running: true,
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
      sequenceAnalyzerEndpointURL,
      sequenceAnalyzerEnabled,
      scrollTimelineData.length,
      setSequenceAnalyzerState,
      getActiveVideoViewportFromCurrentTime,
      fetchVideoViewportFromCurrentTime,
    ]
  );

  /**
   * Get new video viewport when video.currentTime is changed, and Update states
   */
  useVideoViewportSyncEffect(
    videoElementRef,
    getCurrentVideoViewport,
    updatePlayerStandby,
    updateVideoViewport,
    !standaloneModeEnabled ? updateDocumentScrollPositions : undefined // Only update document scroll positions when player is not in standalone mode
  );

  const { handlePlayerOnScroll } = useUserDocumentViewportSyncEffect(
    documentWrapperRef,
    documentContainerRef,
    updateUserDocumentViewport
  );

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
      <div
        id="document_player_container"
        ref={documentContainerRef}
        className="w-full relative"
        style={{
          visibility: playerActive ? "visible" : "hidden",
        }}
      >
        {pdfSrc && (
          <>
            <PDFRenderer pageWidthPx={pageWidthToRender} />
            <VideoViewportRectangle pageWidthPx={pageWidthToRender} />
          </>
        )}
      </div>
    </div>
  );
};
