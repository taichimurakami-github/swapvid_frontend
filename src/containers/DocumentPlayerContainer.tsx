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
  ReactZoomPanPinchRef,
  ReactZoomPanPinchState,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import {
  TBoundingBox,
  TDocumentTimeline,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/@types/types";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import { useSetDocumentPlayerStateCtx } from "@/hooks/useContextConsumer";
import OnDocumentGuideArea from "@/ui/OnDocumentGuideArea";
import {
  useDocumentActivityTimeline,
  useDocumentScrollTimeline,
} from "@/hooks/useDocumentTimeline";

import { calcBboxArea, cvtToTLWHArray, cvtToWHArray } from "@/utils/bboxUtil";
import { getRangeArray } from "@/utils/common";
import { calcRectCollision } from "@/utils/collision";

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
  // for player animation when on/off (temporarily disabled)
  // const animateEffectActive = useRef(false);
  // const animating = useRef(false);

  // for element refs
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLImageElement>(null);
  const guideAreaWrapperRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const pageComponentRef = useRef<HTMLCanvasElement>(null);

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
  const playerStandby = activeScrollTl && activeScrollTl.videoViewport;

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

          const sectionTimeRange =
            videoDuration < v.time[1] //time[1]がInfinityの場合，ビデオの終了まで位置が持続するとみなす
              ? [v.time[0], videoDuration] //time[start, videoEnd]に置換
              : v.time; //time[start, end] をそのまま代入

          const areaRatioCollidedPerViewport = collidedArea / viewportArea;

          return [...sectionTimeRange, areaRatioCollidedPerViewport];
        })
        .filter((v) => !!v) as [number, number, number][]; //nullを除く
    },
    [timeline]
  );

  const updateDocumentStateOnDocumentScroll = useCallback(() => {
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
    getPlaytimeFromCurrentDocumentViewport,
    setDocumentPlayerStateValues,
  ]);

  const updateDocumentStylesOnTimeUpdate = useCallback(
    (
      currentVideoViewport: TBoundingBox,
      documentWidth: number,
      documentHeight: number,
      scrollWrapperElem: HTMLElement
    ) => {
      const [r_areaWidth] = cvtToWHArray(currentVideoViewport);
      const [r_top, r_left, r_width, r_height] =
        cvtToTLWHArray(currentVideoViewport);

      // Syncronize document location and video content
      // only when player is unactive
      if (!playerActive) {
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

        // Syncronize document player scroll position
        scrollWrapperElem.scrollTop = currDocumentStyles.scrollTop;
        scrollWrapperElem.scrollLeft = currDocumentStyles.scrollLeft;
      }

      // Update document guide area styles
      setGuideAreaStyles({
        top: r_top * documentHeight + "px",
        left: r_left * documentWidth + "px",
        width: r_width * documentWidth + "px",
        height: r_height * documentHeight + "px",
      });
    },
    [playerActive, setDocumentStyles, setGuideAreaStyles]
  );

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  useEffect(() => {
    if (!playerActive) {
      handleResetTransform();
    }
  }, [playerActive]);

  /**
   * DocPlayer state updation hooks (Video Current Time driven)
   * 1. Get active timeline section
   * 2. Calculate new document states
   * 3. Dispatch changes depending on specific conditions
   */
  useEffect(() => {
    if (documentContainerRef.current && scrollWrapperRef.current) {
      const activeTlSection = getActiveTlSectionFromPlaytime(
        currentTime,
        documentContainerRef.current.clientHeight
      );

      // Update latest active timeline data
      setActiveScrollTl(activeTlSection);

      // Update video content viewport
      setDocumentPlayerStateValues({
        videoViewport: activeTlSection?.videoViewport,
        standby: !!activeTlSection && !!activeTlSection.videoViewport,
      });

      // Failed to found active section from scroll timeline
      if (!activeTlSection) {
        setDocumentStyles((b) => ({ ...b, standby: false }));
        return;
      }

      // Found activeTlSection but section doesn't record onFocusArea
      if (!activeTlSection.videoViewport) {
        setDocumentStyles((b) => ({ ...b, standby: false }));
        return;
      }

      updateDocumentStylesOnTimeUpdate(
        activeTlSection.videoViewport,
        documentContainerRef.current.clientWidth,
        documentContainerRef.current.clientHeight,
        scrollWrapperRef.current
      );

      // Update activity states
      props.enableInvidActivitiesReenactment &&
        updateAcitvityState(currentTime);
    }
  }, [
    currentTime,
    getActiveTlSectionFromPlaytime,
    updateDocumentStylesOnTimeUpdate,
    updateAcitvityState,
    setDocumentPlayerStateValues,
    props.enableInvidActivitiesReenactment,
  ]);

  const activatePlayer = useCallback(() => {
    !playerActive &&
      playerStandby &&
      setDocumentPlayerStateValues({ active: true });
  }, [setDocumentPlayerStateValues, playerActive, playerStandby]);

  const transformScaleDefault = 1;
  const [zoomModeState, setZoomModeState] =
    useState<null | ReactZoomPanPinchState>(null);
  const prevPointerPos = useRef<null | [number, number]>(null);
  const prevZoomPosCache = useRef<[number, number] | null>(null);
  const momentumScrollingInfo = useRef<
    | {
        prevPos: [number, number];
        vector: [number, number];
        active: true;
      }
    | {
        prevPos: [];
        vector: [];
        active: false;
      }
  >({
    prevPos: [],
    vector: [],
    active: false,
  });
  const momentumScrollingSmoothingSteps = 0.1;
  const resetTransformFlg = useRef(false);

  const handleResetTransform = useCallback(() => {
    if (transformComponentRef.current) {
      resetTransformFlg.current = true;
      const utils = transformComponentRef.current;
      utils.resetTransform();
      momentumScrollingInfo.current = {
        active: false,
        prevPos: [],
        vector: [],
      };
      setZoomModeState(null);
    }
  }, [transformComponentRef]);

  const handleZoomStart = useCallback(
    (e: ReactZoomPanPinchRef) => {
      resetTransformFlg.current = false;
      setZoomModeState(e.state);

      // activatePlayer(); // Cause a bug (activeScrollTl becomes null in activatePlayer(), but Idk why)
      !playerActive && setDocumentPlayerStateValues({ active: true });
    },
    [setZoomModeState, setDocumentPlayerStateValues, playerActive]
  );

  const handleZoomStop = useCallback(
    (e: ReactZoomPanPinchRef) => {
      if (resetTransformFlg.current) return;

      setZoomModeState(e.state);
      prevZoomPosCache.current = [e.state.positionX, e.state.positionY];
    },
    [setZoomModeState]
  );

  const handleScrollOnZoomMode = useCallback(
    (newPositionX: number, newPositionY: number, currentScale: number) => {
      if (transformComponentRef.current) {
        transformComponentRef.current.setTransform(
          newPositionX,
          newPositionY,
          currentScale,
          0
        );

        setZoomModeState((b) => ({
          positionX: newPositionX,
          positionY: newPositionY,
          scale: currentScale,
          previousScale: b?.previousScale ?? 0,
        }));
      }
    },
    [transformComponentRef, setZoomModeState]
  );

  const momentumScrollingAnimationCallback = useCallback(() => {
    const msInfo = momentumScrollingInfo.current;
    console.log(
      // "momentumScrolling animation callback",
      // msInfo.vector,
      prevPointerPos.current
    );

    if (!msInfo.active || !zoomModeState) {
      return;
    }

    const newPosition: [number, number] = [
      msInfo.prevPos[0] + msInfo.vector[0],
      msInfo.prevPos[1] + msInfo.vector[1],
    ];

    handleScrollOnZoomMode(
      // zoomModeState.positionX - msInfo.vector[0],
      // zoomModeState.positionY - msInfo.vector[1],
      ...newPosition,
      zoomModeState.scale
    );

    prevZoomPosCache.current = [
      msInfo.prevPos[0] - msInfo.vector[0],
      msInfo.prevPos[1] - msInfo.vector[1],
    ];

    if (
      momentumScrollingInfo.current.active &&
      (msInfo.vector[0] > 1 || msInfo.vector[1] > 1)
    ) {
      const mul = 1 - momentumScrollingSmoothingSteps;
      momentumScrollingInfo.current = {
        prevPos: newPosition,
        vector: [msInfo.vector[0] * mul, msInfo.vector[1] * mul],
        active: true,
      };

      requestAnimationFrame(momentumScrollingAnimationCallback);
    }
  }, [
    zoomModeState,
    momentumScrollingInfo,
    momentumScrollingInfo.current,
    handleScrollOnZoomMode,
  ]);

  const handleWrapperOnWheel = useCallback(
    (e: React.WheelEvent) => {
      // [PC] Enable free scrolling when zoom mode is enabled
      if (zoomModeState) {
        handleScrollOnZoomMode(
          zoomModeState.positionX - e.deltaX,
          zoomModeState.positionY - e.deltaY,
          zoomModeState.scale
        );
      }

      if (!playerActive) {
        const onClickNode = e.nativeEvent.composedPath()[0] as HTMLElement;
        const isTextClicked =
          onClickNode.nodeName === "SPAN" && !!onClickNode.innerText;
        isTextClicked && activatePlayer();
      }

      activatePlayer();
    },
    [zoomModeState, transformComponentRef, setZoomModeState, activatePlayer]
  );

  const handleWrapperOnTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Initialize momentum scrolling info
      momentumScrollingInfo.current = {
        prevPos: [],
        vector: [],
        active: false,
      };

      // Initialize previous transform positions
      // prevZoomPosCache.current = null;

      if (e.touches.length === 1) {
        prevPointerPos.current = [e.touches[0].clientX, e.touches[0].clientY];
      }

      activatePlayer();
    },
    [playerActive, zoomModeState, prevPointerPos, activatePlayer]
  );

  const handleWrapperOnTouchMove = useCallback(
    (e: React.TouchEvent) => {
      // Update cached pointer event

      if (playerActive && zoomModeState && e.touches.length === 1) {
        // [Touch Device] Enable free scrolling when zoom mode is enabled, if document is swiped by a single finger
        const pt: [number, number] = [
          e.touches[0].clientX,
          e.touches[0].clientY,
        ];

        if (
          prevPointerPos.current &&
          zoomModeState &&
          prevZoomPosCache.current
        ) {
          const delta: [number, number] = [
            pt[0] - prevPointerPos.current[0],
            pt[1] - prevPointerPos.current[1],
          ];

          const newPosition: [number, number] = [
            prevZoomPosCache.current[0] + delta[0],
            prevZoomPosCache.current[1] + delta[1],
          ];

          handleScrollOnZoomMode(...newPosition, zoomModeState.scale);

          momentumScrollingInfo.current = {
            prevPos: [...newPosition],
            vector: delta,
            active: true, // Set momentum scrolling flg
          };
          prevZoomPosCache.current = [...newPosition];
        }

        prevPointerPos.current = pt;
      }
    },
    [zoomModeState, handleScrollOnZoomMode]
  );

  const handleWrapperOnTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      requestAnimationFrame(momentumScrollingAnimationCallback);

      setTestState([]);
    },
    [transformComponentRef, momentumScrollingAnimationCallback]
  );

  const [testState, setTestState] = useState([]);

  return (
    <Document
      file={props.pdfSrc}
      onLoadSuccess={onDocumentLoadSuccess}
      onWheel={handleWrapperOnWheel}
      onTouchStart={handleWrapperOnTouchStart}
      onTouchMove={handleWrapperOnTouchMove}
      onTouchEnd={handleWrapperOnTouchEnd}
      // onTouchStart={handleWrapperOnTouchStart}
      // onMouseDown={(e: React.MouseEvent) => {
      //   if (!playerActive) {
      //     const onClickNode = e.nativeEvent.composedPath()[0] as HTMLElement;
      //     const isTextClicked =
      //       onClickNode.nodeName === "SPAN" && !!onClickNode.innerText;
      //     isTextClicked && activatePlayer();
      //   }
      // }}
    >
      <div
        id="document_viewer_wrapper"
        className="w-full h-full original-player-container bg-white"
        onClick={() => {
          props.enableDispatchVideoElementClickEvent &&
            !playerActive &&
            videoElement.click();
        }}
        // onPointerDown={handleWrapperOnPointerDown}
        // onPointerMove={handleWrapperOnPointerMove}
        // onPointerUp={handleWrapperOnPointerUp}
      >
        <div
          id="document_viewer_container"
          className="relative w-full h-full overflow-hidden"
        >
          <TransformWrapper
            initialScale={transformScaleDefault}
            wheel={{ wheelDisabled: true, smoothStep: 0.02 }}
            panning={{ disabled: true }}
            alignmentAnimation={{ disabled: true }}
            ref={transformComponentRef}
            onZoomStart={handleZoomStart}
            onZoomStop={handleZoomStop}
            onTransformed={(e) => {
              console.log("trnasform");
              handleZoomStop(e);
            }}
          >
            <div
              id="document_viewer_scroll_wrapper"
              className="relative w-full h-full scrollbar-hidden z-0"
              style={{
                width: videoElement.clientWidth + "px",
                height: videoElement.clientHeight + "px",
                overflow: zoomModeState ? "hidden" : "scroll",
              }}
              ref={scrollWrapperRef}
              onScroll={(e) => {
                updateDocumentStateOnDocumentScroll();
              }}
            >
              <TransformComponent>
                <div
                  className="relative"
                  style={{
                    width: `${documentStyles.width}px`,
                    scale: documentStyles.scale,
                    pointerEvents:
                      playerStandby || playerActive ? "all" : "none",
                  }}
                  ref={documentContainerRef}
                >
                  {getRangeArray(docNumPages, 1).map((i) => (
                    <Page
                      width={documentStyles.width}
                      pageNumber={i}
                      renderTextLayer={!!zoomModeState}
                      canvasRef={pageComponentRef}
                    />
                  ))}
                </div>
              </TransformComponent>
              <div
                className="absolute top-0 left-0 w-full h-full"
                ref={guideAreaWrapperRef}
              >
                {guideAreaStyles && !zoomModeState && (
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
          </TransformWrapper>
          {zoomModeState && (
            <>
              <div className="absolute top-0 left-0 w-full h-full border border-[20px] border-slate-600 opacity-50 z-10 pointer-events-none"></div>
              <button
                className="p-2 absolute bottom-2 left-1/2 -translate-x-1/2 p-2 bg-slate-600 text-white font-bold text-xl rounded-md z-10"
                onClick={handleResetTransform}
              >
                Exit Zoom Mode<br></br>({" "}
                {Math.round((zoomModeState ? zoomModeState.scale : 0) * 100)} %
                )
              </button>
              <div
                className="absolute top-0 left-0 p-2 black text-white"
                style={{ background: "rgba(0, 0, 0, 0.8)" }}
              >
                {testState.map((v) => (
                  <p>debugger : {v}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* </TransformWrapper> */}
    </Document>
  );
}
