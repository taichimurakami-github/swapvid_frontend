import React, {
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
  useState,
} from "react";

import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import {
  TAssetId,
  TBoundingBox,
  TDocumentTimeline,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/@types/types";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import { useSetDocumentPlayerStateCtx } from "@/hooks/useContextConsumer";
import OnDocumentGuideArea from "@/ui/OnDocumentGuideArea";

import { cvtToTLWHArray, cvtToWHArray } from "@/utils/bboxUtil";
import { getRangeArray } from "@/utils/common";
import useSequenceAnalyzer from "@/hooks/useSequenceAnalyzer";

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
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLImageElement>(null);
  const guideAreaWrapperRef = useRef<HTMLDivElement>(null);

  const videoElement = props.videoElement;
  const currentTime = useVideoCurrenttime(props.videoElement);
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();
  const { matchContentSequence } = useSequenceAnalyzer(
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

  const [docNumPages, setDocNumPages] = useState<number>(0);

  const playerActive = props.playerActive;
  const playerStandby = activeVideoViewport;

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }): void => {
      setDocNumPages(numPages);
    },
    [setDocNumPages]
  );

  const updateDocumentState = useCallback(() => {
    if (documentContainerRef.current && scrollWrapperRef.current) {
      const documentWidth = documentContainerRef.current.clientWidth;
      const documentHeight = documentContainerRef.current.clientHeight;
      const playerViewportWidth = scrollWrapperRef.current.clientWidth;
      const playerViewportHeight = scrollWrapperRef.current.clientHeight;

      const currDocLeft = scrollWrapperRef.current.scrollLeft / documentWidth;
      const currDocTop = scrollWrapperRef.current.scrollTop / documentHeight;
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
        wrapperWindowHeight: scrollWrapperRef.current.clientHeight,
        // activeTimes,
      });
    }
  }, [
    scrollWrapperRef,
    props.documentBaseImageSrc,
    // getPlaytimeFromInDocScrollY,
    // getPlaytimeFromCurrentDocumentViewport,
    setDocumentPlayerStateValues,
  ]);

  const updateDocumentStyles = useCallback(
    (
      currentVideoViewport: TBoundingBox,
      documentWidth: number,
      documentHeight: number,
      scrollWrapperElem: HTMLElement
    ) => {
      const [r_areaWidth] = cvtToWHArray(currentVideoViewport);
      const [r_top, r_left, r_width, r_height] =
        cvtToTLWHArray(currentVideoViewport);

      const zoomRate = r_areaWidth > 0 ? 1 / r_areaWidth : 1.0;
      const currDocumentStyles = {
        scrollTop: documentHeight * r_top,
        scrollLeft: documentWidth * r_left,
        scale: zoomRate,
        standby: true,
      };

      // Update document styles
      setDocumentStyles((b) => ({
        ...currDocumentStyles,
        // Set width only when player is unactive
        // because width change make <Page /> component to re-render pdf
        // due to using HTML Canvas API
        width: !playerActive ? videoElement.clientWidth * zoomRate : b.width,
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
    },
    [playerActive, setDocumentStyles, setGuideAreaStyles]
  );

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  /**
   * DocPlayer state updation hooks (Video Current Time driven)
   * 1. Get active timeline section
   * 2. Calculate new document states
   * 3. Dispatch changes depending on specific conditions
   */
  const currentTimePrevSent = useRef<number>(0);
  useEffect(() => {
    /** TODO: Get video viewport from server */

    if (
      documentContainerRef.current &&
      scrollWrapperRef.current &&
      Math.abs(currentTime - currentTimePrevSent.current) > 0.1
    ) {
      matchContentSequence().then((result) => {
        if (!result) return;

        const videoViewport = result.matching_result;
        setActiveVideoViewport(videoViewport);

        setDocumentPlayerStateValues({
          videoViewport,
          standby: !!videoViewport,
        });

        console.log(videoViewport);

        videoViewport &&
          updateDocumentStyles(
            videoViewport,
            (documentContainerRef.current as HTMLDivElement).clientWidth,
            (documentContainerRef.current as HTMLDivElement).clientHeight,
            scrollWrapperRef.current as HTMLDivElement
          );
      });
      currentTimePrevSent.current = currentTime;
    }

    /** ------------------------------------ */

    // const matchResult: null | {
    //   videoViewport: null | TBoundingBox;
    // } = (() =>
    //   Math.random() > 0.5
    //     ? null
    //     : {
    //         videoViewport: [
    //           [0, 0],
    //           [0, 0],
    //         ],
    //       })();

    // const videoViewport = matchResult?.videoViewport;
    // const standby = !!matchResult && !!matchResult?.videoViewport;

    // setDocumentPlayerStateValues({
    //   videoViewport,
    //   standby,
    // });

    // matchResult?.videoViewport &&
  }, [
    currentTime,
    props.videoElement,
    matchContentSequence,
    setDocumentPlayerStateValues,
    updateDocumentStyles,
  ]);

  const activatePlayer = useCallback(() => {
    !playerActive &&
      playerStandby &&
      setDocumentPlayerStateValues({ active: true });
  }, [setDocumentPlayerStateValues, playerActive, playerStandby]);

  return (
    <Document
      file={props.pdfSrc}
      onLoadSuccess={onDocumentLoadSuccess}
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
        id="document_viewer_wrapper"
        className="w-full h-full original-player-container bg-white"
        onClick={() => {
          props.enableDispatchVideoElementClickEvent &&
            !playerActive &&
            videoElement.click();
        }}
      >
        <div
          id="document_viewer_container"
          className="relative w-full h-full overflow-hidden"
        >
          <div
            id="document_viewer_scroll_wrapper"
            className="relative w-full h-full overflow-scroll scrollbar-hidden"
            style={{
              width: videoElement.clientWidth + "px",
              height: videoElement.clientHeight + "px",
            }}
            ref={scrollWrapperRef}
            onScroll={updateDocumentState}
          >
            <div
              style={{
                width: documentStyles.width + "px",
                pointerEvents: playerStandby || playerActive ? "all" : "none",
              }}
              ref={documentContainerRef}
            >
              {getRangeArray(docNumPages, 1).map((i) => (
                <Page
                  width={documentStyles.width}
                  pageNumber={i}
                  renderTextLayer
                />
              ))}
            </div>
            <div
              className="absolute top-0 left-0 w-full h-full"
              ref={guideAreaWrapperRef}
            >
              {guideAreaStyles && (
                <OnDocumentGuideArea
                  {...guideAreaStyles}
                  docViewerWidth={scrollWrapperRef.current?.clientWidth ?? 0}
                  docViewerHeight={scrollWrapperRef.current?.clientHeight ?? 0}
                  active={true}
                ></OnDocumentGuideArea>
              )}
            </div>
          </div>
        </div>
      </div>
    </Document>
  );
}
