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
  TBoundingBox,
  TDocumentTimeline,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/types/swapvid";
import { useVideoCurrenttime } from "@hooks/useVideoCurrenttime";
import { useSetDocumentPlayerStateCtx } from "@hooks/useContextConsumer";
import OnDocumentGuideArea from "@ui/OnDocumentGuideArea";
import {
  useDocumentActivityTimeline,
  useDocumentScrollTimeline,
} from "@hooks/useDocumentTimeline";

import { calcBboxArea, cvtToTLWHArray, cvtToWHArray } from "@utils/bboxUtil";
import { getRangeArray } from "@utils/common";
import { calcRectCollision } from "@utils/collision";

export default function DocumentPlayerCombinedLocalContainer(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    scrollTimeline: TServerGeneratedScrollTimeline | null;
    activityTimeline: TServerGeneratedActivityTimeline | null;
    widthPx: number;
    heightPx: number;
    playerActive: boolean;
    pdfSrc: string;
    documentBaseImageSrc: string;
    pageZoomRate?: number;
    scrollWrapperId?: string;
    scrollWrapperOpacityWhenUnactive?: number;
    showScrollBar?: boolean;
    forceToActivatePlayerByUserManipulation?: boolean;
    enableDispatchVideoElementClickEvent?: boolean;
    enableCenteredScrollYBaseline?: boolean;
    enableInvidActivitiesReenactment?: boolean;
    disableUnactiveAnimation?: boolean;
    disableTextLayer?: boolean;
    disableVideoViewportVisualization?: boolean;
  }>
) {
  // for player animation when on/off
  // const animateEffectActive = useRef(false);
  // const animating = useRef(false);

  // for element refs
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLImageElement>(null);
  const guideAreaWrapperRef = useRef<HTMLDivElement>(null);

  const videoElement = props.videoElement;
  const currentTime = useVideoCurrenttime(props.videoElement);
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  const [activeScrollTl, setActiveScrollTl] = useState<
    TDocumentTimeline[0] | null
  >(null);

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

  const { timeline } = useDocumentScrollTimeline(
    props.scrollTimeline || {
      media_metadata: [0, 0, 0, 0],
      document_metadata: [0, 0],
      tl_document_scrollY: [],
    }
  );

  const {
    // activityState,
    updateAcitvityState,
    // getActivityAssets,
    // getAssetsMetadata,
  } = useDocumentActivityTimeline(
    props?.activityTimeline ?? {
      video_metadata: [0, 0],
      doc_metadata: [0, 0],
      activities: [],
    },
    props.scrollTimeline ?? {
      media_metadata: [0, 0, 0, 0],
      document_metadata: [0, 0],
      tl_document_scrollY: [],
    },
    videoElement,
    scrollWrapperRef.current
  );

  const playerActive = props.playerActive;
  const playerStandby = activeScrollTl && activeScrollTl.videoViewport;

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }): void => {
      setDocNumPages(numPages);
    },
    [setDocNumPages]
  );

  const getActiveTlSectionFromPlaytime = useCallback(
    (time: number): TDocumentTimeline[0] | null => {
      const currentSection =
        timeline.find((v) => v.time[0] <= time && time < v.time[1]) ?? null;

      return currentSection;
    },
    [timeline]
  );

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

      const activeTimes = getPlaytimeFromCurrentDocumentViewport(
        documentViewport,
        videoElement.duration
      );

      setDocumentPlayerStateValues({
        baseImgSrc: props.documentBaseImageSrc,
        documentViewport: documentViewport,
        wrapperScrollHeight: documentContainerRef.current.clientHeight,
        wrapperWindowHeight: scrollWrapperRef.current.clientHeight,
        activeTimes,
      });
    }
  }, [
    scrollWrapperRef,
    // getPlaytimeFromInDocScrollY,
    getPlaytimeFromCurrentDocumentViewport,
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
    [playerActive, setGuideAreaStyles]
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
  useEffect(() => {
    if (documentContainerRef.current && scrollWrapperRef.current) {
      const activeTlSection = getActiveTlSectionFromPlaytime(currentTime);

      setActiveScrollTl(activeTlSection);
      setDocumentPlayerStateValues({
        videoViewport: activeTlSection?.videoViewport,
        standby: !!activeTlSection && !!activeTlSection.videoViewport,
      });

      // Failed to found active section from scroll timeline
      if (!activeTlSection) {
        return;
      }

      // Found activeTlSection but section doesn't record onFocusArea
      if (!activeTlSection.videoViewport) {
        return;
      }

      updateDocumentStyles(
        activeTlSection.videoViewport,
        documentContainerRef.current.clientWidth,
        documentContainerRef.current.clientHeight,
        scrollWrapperRef.current
      );

      // Update activity states
      props.enableInvidActivitiesReenactment &&
        updateAcitvityState(currentTime);
    }
  }, [currentTime]);

  return (
    <Document file={props.pdfSrc} onLoadSuccess={onDocumentLoadSuccess}>
      <div
        id="document_viewer_wrapper"
        className="w-full h-full original-player-container"
        onClick={() => {
          props.enableDispatchVideoElementClickEvent &&
            !playerActive &&
            videoElement.click();
        }}
      >
        <div
          id="document_viewer_container"
          className="relative overflow-hidden  mx-auto"
          style={{
            width: props.widthPx + "px",
            height: props.heightPx + "px",
          }}
        >
          <div
            id="document_viewer_scroll_wrapper"
            className={`relative w-full h-full overflow-scroll ${
              props.showScrollBar ? "" : "scrollbar-hidden"
            }`}
            style={{
              width: props.widthPx + "px",
              height: props.heightPx + "px",
            }}
            ref={scrollWrapperRef}
            onScroll={updateDocumentState}
          >
            <div
              style={{
                width: props.widthPx + "px",
                pointerEvents: playerStandby || playerActive ? "all" : "none",
              }}
              ref={documentContainerRef}
            >
              {getRangeArray(docNumPages, 1).map((i) => (
                <Page
                  width={props.widthPx * (props.pageZoomRate ?? 1)}
                  pageNumber={i}
                  renderTextLayer={!props.disableTextLayer}
                />
              ))}
            </div>
            {!props.disableVideoViewportVisualization && (
              <div
                className="absolute top-0 left-0 w-full h-full"
                ref={guideAreaWrapperRef}
              >
                {guideAreaStyles && (
                  <OnDocumentGuideArea
                    {...guideAreaStyles}
                    docViewerWidth={scrollWrapperRef.current?.clientWidth ?? 0}
                    docViewerHeight={
                      scrollWrapperRef.current?.clientHeight ?? 0
                    }
                    active={true}
                  ></OnDocumentGuideArea>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Document>
  );
}
