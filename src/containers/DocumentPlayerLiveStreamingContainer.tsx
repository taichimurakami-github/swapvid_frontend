import React, {
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
  useState,
} from "react";

import {
  TAssetId,
  TBoundingBox,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/@types/types";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import {
  useSetDocumentPlayerStateCtx,
  useVideoCropAreaCtx,
} from "@/hooks/useContextConsumer";
import OnDocumentGuideArea from "@/ui/OnDocumentGuideArea";

import { cvtToTLWHArray, cvtToWHArray } from "@/utils/bboxUtil";
import useSequenceAnalyzer, {
  SequenceAnalyzerOkResponseBody,
} from "@/hooks/useSequenceAnalyzer";
import PDFDocumentViewer from "./PDFDocumentViewer";

export default function DocumentPlayerLiveStreamingContainer(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    assetId: TAssetId;
    scrollTimeline: TServerGeneratedScrollTimeline | null;
    activityTimeline: TServerGeneratedActivityTimeline | null;
    playerActive: boolean;
    pdfSrc: string;
    documentBaseImageSrc: string;
    scrollWrapperId?: string;
    enableDispatchVideoElementClickEvent?: boolean;
    enableCombinedView?: boolean;
    scrollWrapperOpacityWhenUnactive?: number;
    enableCenteredScrollYBaseline?: boolean;
    enableInvidActivitiesReenactment?: boolean;
    disableUnactiveAnimation?: boolean;
  }>
) {
  // for element refs
  const documentWrapperRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLImageElement>(null);
  const guideAreaWrapperRef = useRef<HTMLDivElement>(null);

  const videoElement = props.videoElement;
  const currentTime = useVideoCurrenttime(props.videoElement);
  const videoCropArea = useVideoCropAreaCtx();

  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();
  const { matchContentSequenceOnVideoTimeUpdate } = useSequenceAnalyzer(
    props.assetId,
    props.videoElement
  );

  const [activeVideoViewport, setActiveVideoViewport] =
    useState<null | TBoundingBox>(null);

  const [documentStyles, setDocumentStyles] = useState({
    scrollTop: 0,
    scrollLeft: 0,
    width: videoElement.clientWidth,
    scale: 1.0,
  });

  const [guideAreaStyles, setGuideAreaStyles] = useState<{
    top: number | string;
    left: number | string;
    width: number | string;
    height: number | string;
  } | null>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const playerActive = props.playerActive;
  const playerStandby = activeVideoViewport;

  const updateDocumentStateOnScroll = useCallback(() => {
    if (documentContainerRef.current && documentWrapperRef.current) {
      const documentWidth = documentContainerRef.current.clientWidth;
      const documentHeight = documentContainerRef.current.clientHeight;
      const playerViewportWidth = documentWrapperRef.current.clientWidth;
      const playerViewportHeight = documentWrapperRef.current.clientHeight;

      const currDocLeft = documentWrapperRef.current.scrollLeft / documentWidth;
      const currDocTop = documentWrapperRef.current.scrollTop / documentHeight;
      const currDocWidth = playerViewportWidth / documentWidth;
      const currDocHeight = playerViewportHeight / documentHeight;

      const documentViewport: [[number, number], [number, number]] = [
        [currDocLeft, currDocTop],
        [currDocLeft + currDocWidth, currDocTop + currDocHeight],
      ];

      // const activeTimes = getPlaytimeFromCurrentDocumentViewport(
      //   documentViewport,
      //   videoElement.duration
      // );

      setDocumentPlayerStateValues({
        baseImgSrc: props.documentBaseImageSrc,
        documentViewport: documentViewport,
        wrapperScrollHeight: documentContainerRef.current.clientHeight,
        wrapperWindowHeight: documentWrapperRef.current.clientHeight,
        // activeTimes,
      });
    }
  }, [
    documentWrapperRef,
    props.documentBaseImageSrc,
    // getPlaytimeFromInDocScrollY,
    // getPlaytimeFromCurrentDocumentViewport,
    setDocumentPlayerStateValues,
  ]);

  const updateDocumentAndGuideAreaStylesOnVideoTimeUpdate = useCallback(
    (
      currentVideoViewport: TBoundingBox,
      documentWidth: number,
      documentHeight: number,
      scrollWrapperElem: HTMLElement
    ) => {
      if (documentWrapperRef.current) {
        const [r_areaWidth] = cvtToWHArray(currentVideoViewport);
        const [r_top, r_left, r_width, r_height] =
          cvtToTLWHArray(currentVideoViewport);

        const zoomRate = r_areaWidth > 0 ? 1 / r_areaWidth : 1.0;
        const currDocumentStyles = {
          scrollTop: documentHeight * r_top,
          scrollLeft: documentWidth * r_left,
          scale: zoomRate,
          standby: true,
          width: documentWrapperRef.current.clientWidth * zoomRate,
        };

        // Update document styles
        setDocumentStyles((b) => ({
          ...currDocumentStyles,
          // Set width only when player is unactive
          // because width change make <Page /> component to re-render pdf due to HTML Canvas API
          // which can cause performance issue.
          //
          // width: !playerActive ? videoElement.clientWidth * zoomRate : b.width,
          width: !playerActive
            ? currDocumentStyles.width
            : // ? documentWrapperRef.current?.clientWidth ??
              //   videoElement.clientWidth * zoomRate
              b.width,
        }));

        // Update document guide area styles
        setGuideAreaStyles({
          top: r_top * documentHeight + "px",
          left: r_left * documentWidth + "px",
          width: r_width * documentWidth + "px",
          height: r_height * documentHeight + "px",
        });

        // Syncronize document player scroll position
        if (!playerActive) {
          scrollWrapperElem.scrollTop = currDocumentStyles.scrollTop;
          scrollWrapperElem.scrollLeft = currDocumentStyles.scrollLeft;
        }
      }
    },
    [playerActive, documentWrapperRef, setDocumentStyles, setGuideAreaStyles]
  );

  /**
   * DocPlayer state updation hooks (Video Current Time driven)
   * Use sequence analyzer to get current video viewport and update document player state.
   */
  useEffect(() => {
    if (documentContainerRef.current && documentWrapperRef.current) {
      matchContentSequenceOnVideoTimeUpdate(currentTime).then((result) => {
        if (!result || result.status === "ERROR") return;

        const resultContent =
          result.bodyContent as SequenceAnalyzerOkResponseBody;

        const videoViewport = resultContent.estimated_viewport;
        setActiveVideoViewport(videoViewport);

        setDocumentPlayerStateValues({
          videoViewport,
          standby: !!videoViewport,
          documentAvailable: resultContent.document_available,
        });

        // console.log(`Video viewport updated: ${videoViewport}`);

        videoViewport &&
          updateDocumentAndGuideAreaStylesOnVideoTimeUpdate(
            videoViewport,
            (documentContainerRef.current as HTMLDivElement).clientWidth,
            (documentContainerRef.current as HTMLDivElement).clientHeight,
            documentWrapperRef.current as HTMLDivElement
          );
      });
    }
  }, [
    currentTime,
    props.videoElement,
    matchContentSequenceOnVideoTimeUpdate,
    setDocumentPlayerStateValues,
    updateDocumentAndGuideAreaStylesOnVideoTimeUpdate,
  ]);

  const activatePlayer = useCallback(() => {
    !playerActive &&
      playerStandby &&
      setDocumentPlayerStateValues({ active: true });
  }, [setDocumentPlayerStateValues, playerActive, playerStandby]);

  return (
    <div
      id="document_viewer_wrapper"
      className="w-full h-full original-player-container"
      style={{
        pointerEvents: playerStandby || playerActive ? "all" : "none",
      }}
      onClick={() => {
        props.enableDispatchVideoElementClickEvent &&
          !playerActive &&
          videoElement.click();
      }}
      onWheel={activatePlayer}
      onTouchStart={activatePlayer}
      onMouseDown={(e: React.MouseEvent) => {
        if (!playerActive) {
          const onClickNode = e.nativeEvent.composedPath()[0] as HTMLElement;
          const isTextClicked =
            onClickNode.nodeName === "SPAN" && !!onClickNode.innerText;
          isTextClicked && activatePlayer();
        }
      }}
    >
      <div
        /**
         * Document Scrolling Wrapper
         * Define area for rendering document viewer.
         */
        id="document_viewer_scroll_wrapper"
        className="relative overflow-scroll scrollbar-hidden bg-white"
        style={{
          width: videoCropArea
            ? videoCropArea.videoScale.width
            : videoElement.clientWidth,
          height: videoCropArea
            ? videoCropArea.videoScale.height
            : videoElement.clientHeight,
          top: videoCropArea ? videoCropArea.videoScale.top : 0,
          left: videoCropArea ? videoCropArea.videoScale.left : 0,
        }}
        ref={documentWrapperRef}
        onScroll={updateDocumentStateOnScroll}
      >
        <div
          /**
           * Document Container
           * Render whole document without hiding overflow part.
           */
          style={{
            width: documentStyles.width + "px",
          }}
          ref={documentContainerRef}
        >
          <PDFDocumentViewer
            pdfSrc={props.pdfSrc}
            pageWidth={documentStyles.width}
          />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full"
          ref={guideAreaWrapperRef}
        >
          {guideAreaStyles && (
            <OnDocumentGuideArea
              {...guideAreaStyles}
              docViewerWidth={documentWrapperRef.current?.clientWidth ?? 0}
              docViewerHeight={documentWrapperRef.current?.clientHeight ?? 0}
              active={true}
            ></OnDocumentGuideArea>
          )}
        </div>
      </div>
    </div>
  );
}
