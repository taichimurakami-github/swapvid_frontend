import React, {
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
  useState,
} from "react";
import {
  TDocumentTimeline,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/@types/types";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import {
  // useDocumentPlayerStateCtx,
  useSetDocumentPlayerStateCtx,
} from "@/hooks/useContextConsumer";
import OnDocumentGuideArea from "@/ui/OnDocumentGuideArea";
import {
  useDocumentActivityTimeline,
  useDocumentScrollTimeline,
} from "@/hooks/useDocumentTimeline";
import { cvtToTLWHArray, cvtToWHArray } from "@/utils/bboxUtil";
// import { ZoomablePDFViewer } from "./ZoomablePDFViewerContainer";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { getRangeArray } from "@/utils/common";

export default function DocumentPlayerContainer(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
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
  // for player animation when on/off
  const animateEffectActive = useRef(false);
  const animating = useRef(false);

  // for element refs
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLImageElement>(null);
  const guideAreaWrapperRef = useRef<HTMLDivElement>(null);

  const videoElement = props.videoElement;
  const currentTime = useVideoCurrenttime(props.videoElement);
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  const [activeScrollTl, setActiveScrollTl] = useState<
    TDocumentTimeline[0] | null
  >(null);

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
  const playerStandby = activeScrollTl && activeScrollTl.invidFocusedArea;

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }): void => {
      setDocNumPages(numPages);
    },
    [setDocNumPages]
  );

  const getActiveTlSectionFromPlaytime = useCallback(
    (time: number, maxScrollY: number): TDocumentTimeline[0] | null => {
      const currentSection =
        timeline.find((v) => v.time[0] <= time && time < v.time[1]) ?? null;

      return currentSection;
    },
    [timeline]
  );

  const getPlaytimeFromInDocScrollY = useCallback(
    (
      currentScrollY: number,
      maxScrollY: number,
      videoDuration: number
    ): [number, number][] => {
      const MARGIN = 150;
      const targetSections = timeline.filter((v) => {
        if (!v.invidFocusedArea) return false;

        const onFocusAreaTop = v.invidFocusedArea[0][1];

        return (
          onFocusAreaTop * maxScrollY - MARGIN <= currentScrollY && //Is current scroll Y larger than onFocusArea.top ?
          currentScrollY <= onFocusAreaTop * maxScrollY + MARGIN //Is current scroll Y smaller than onFocusArea.top ?
        );
      });

      return targetSections.map((v) => {
        return videoDuration < v.time[1] //time[1]がInfinityの場合，ビデオの終了まで位置が持続するとみなす
          ? [v.time[0], videoDuration] //time[start, videoEnd]に置換
          : v.time; //time[start, end] をそのまま代入
      });
    },
    [timeline]
  );

  const updateDocumentState = useCallback(() => {
    if (documentRef.current && scrollWrapperRef.current) {
      const currDocScrollY = scrollWrapperRef.current.scrollTop;
      const currDocLeft = 0;
      const currDocTop = currDocScrollY / documentRef.current.clientHeight;
      const currDocWidth =
        scrollWrapperRef.current.clientWidth / documentRef.current.clientWidth;
      const currDocHeight =
        scrollWrapperRef.current.clientHeight /
        documentRef.current.clientHeight;

      const activeTimes = getPlaytimeFromInDocScrollY(
        currDocScrollY,
        documentRef.current.clientHeight,
        videoElement.duration
      );

      setDocumentPlayerStateValues({
        baseImgSrc: props.documentBaseImageSrc,
        documentOnFocusArea: [
          [currDocLeft, currDocTop],
          [currDocLeft + currDocWidth, currDocTop + currDocHeight],
        ],
        wrapperScrollHeight: documentRef.current.clientHeight,
        wrapperWindowHeight: scrollWrapperRef.current.clientHeight,
        activeTimes,
      });
    }
  }, [
    scrollWrapperRef,
    getPlaytimeFromInDocScrollY,
    setDocumentPlayerStateValues,
  ]);

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
    if (documentRef.current && scrollWrapperRef.current) {
      const activeTlSection = getActiveTlSectionFromPlaytime(
        currentTime,
        documentRef.current.clientHeight
      );

      setActiveScrollTl(activeTlSection);
      setDocumentPlayerStateValues({
        videoOnFocusArea: activeTlSection?.invidFocusedArea,
        standby: !!activeTlSection,
      });

      // Failed to found active section from scroll timeline
      if (!activeTlSection) {
        setDocumentPlayerStateValues({ standby: false });
        setDocumentStyles((b) => ({ ...b, standby: false }));
        return;
      }

      // Found activeTlSection but section doesn't record onFocusArea
      if (!activeTlSection.invidFocusedArea) {
        setDocumentStyles((b) => ({ ...b, standby: false }));
        return;
      }

      // if (!animateEffectActive.current) {
      const [r_areaWidth] = cvtToWHArray(activeTlSection.invidFocusedArea);

      const zoomRate = r_areaWidth > 0 ? 1 / r_areaWidth : 1.0;
      const currContentWidth = documentRef.current.clientWidth;
      const currContentHeight = documentRef.current.clientHeight;

      const [r_top, r_left, r_width, r_height] = cvtToTLWHArray(
        activeTlSection.invidFocusedArea
      );

      // Update document styles
      const currentDocumentStyles = {
        scrollTop: currContentHeight * r_top,
        scrollLeft: currContentWidth * r_left,
        scale: zoomRate,
        standby: true,

        // Set width only when player is unactive
        // because width change make <Page /> component to re-render pdf
        // due to using HTML Canvas API
        width: props.playerActive
          ? documentStyles.width
          : videoElement.clientWidth * zoomRate,
      };
      setDocumentStyles(currentDocumentStyles);

      // Syncronize document player scroll position
      !props.playerActive &&
        scrollWrapperRef.current.scroll(
          documentStyles.scrollLeft,
          documentStyles.scrollTop
        );

      // Update document guide area styles
      if (guideAreaWrapperRef.current) {
        guideAreaWrapperRef.current.style.width = currContentWidth + "px";
        guideAreaWrapperRef.current.style.height = currContentHeight + "px";

        setGuideAreaStyles({
          top: r_top * currContentHeight + "px",
          left: r_left * currContentWidth + "px",
          width: r_width * currContentWidth + "px",
          height: r_height * currContentHeight + "px",
        });
      }
      // }

      // (additional)4. Update activity states
      props.enableInvidActivitiesReenactment &&
        updateAcitvityState(currentTime);
    }
  }, [currentTime]);

  return (
    <div
      style={{
        pointerEvents: playerActive || playerStandby ? "all" : "none",
      }}
      onWheel={() => {
        if (!playerActive && playerStandby) {
          setDocumentPlayerStateValues({ active: true });
        }
      }}
    >
      <Document file={props.pdfSrc} onLoadSuccess={onDocumentLoadSuccess}>
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
                  pointerEvents: playerActive && playerStandby ? "all" : "none",
                }}
                ref={documentRef}
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
                    docViewerHeight={
                      scrollWrapperRef.current?.clientHeight ?? 0
                    }
                    active={true}
                  ></OnDocumentGuideArea>
                )}
              </div>
            </div>
          </div>
        </div>
      </Document>
    </div>
  );
}
