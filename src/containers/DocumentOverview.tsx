import React, {
  CSSProperties,
  PointerEvent,
  WheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { faFileInvoice, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  documentOverviewActiveAtom,
  documentOverviewImgSrcAtom,
  documentPlayerActiveAtom,
  documentPlayerLayoutAtom,
  documentPlayerWrapperElementRefAtom,
  userDocumentViewportAtom,
  videoViewportAtom,
} from "@/providers/jotai/store";
import { useAtom, useAtomValue } from "jotai/react";
import { cvtToTLWHArray } from "@/utils/bboxUtil";
import { usePointerDrag } from "@/hooks/usePointerDrag";

/**
 * FIXME:
 *
 * 1. The document/video area is rendered in incorrect position and scale.
 * 2. The scroll position sync is not working correctly.
 */
const _DocumentOverview: React.FC<{
  widthPx: number;
  zIndex?: number;
  standaloneModeEnabled?: boolean;
}> = ({ widthPx, zIndex, standaloneModeEnabled }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const backgroundImgRef = useRef<HTMLImageElement>(null);

  // const [documentAreaStyle, setDocumentAreaStyle] = useState<CSSProperties>({});

  const [documentOverviewActive, setDocumentOverviewActive] = useAtom(
    documentOverviewActiveAtom
  );
  const imagedPdfSrc = useAtomValue(documentOverviewImgSrcAtom);
  const documentPlayerLayout = useAtomValue(documentPlayerLayoutAtom);
  const documentPlayerActive = useAtomValue(documentPlayerActiveAtom);
  const videoViewport = useAtomValue(videoViewportAtom);
  const userDocumentViewport = useAtomValue(userDocumentViewportAtom);
  const documentPlayerWrapperRef = useAtomValue(
    documentPlayerWrapperElementRefAtom
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!userDocumentViewport) return;

      const wrapperBrect = e.currentTarget.getBoundingClientRect();

      const documentAreaTop = userDocumentViewport[0][1];
      const documentAreaBottom = userDocumentViewport[1][1];

      const newScrollYRatio =
        (-1 * (documentAreaBottom - documentAreaTop)) / 2 +
        (e.clientY - wrapperBrect.top) / wrapperBrect.height;

      if (documentPlayerWrapperRef?.current) {
        documentPlayerWrapperRef.current.scrollTop =
          documentPlayerLayout.containerHeight * newScrollYRatio;
      }
    },
    [
      documentPlayerLayout,
      userDocumentViewport,
      documentPlayerWrapperRef,
      // documentPlayerState?.scrollHeight,
    ] // Update when documentPlayerState.scrollHeight is updated
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent, isDragging: boolean) => {
      if (!isDragging) return;

      handlePointerDown(e);
    },
    [handlePointerDown] // Sync handlePointerDown to newest state
  );

  const { handlers, isDragging } = usePointerDrag({
    onPointerDownHook: handlePointerDown,
    onPointerMoveHook: handlePointerMove,
  });

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // dragging中は発火しない
      if (isDragging) return;

      /** Syncronize documentPlayerWrapper.scrollTop with documentOverview.scrollTop */
      if (documentPlayerWrapperRef?.current) {
        documentPlayerWrapperRef.current.scrollTop += e.deltaY;
      }
    },
    [isDragging, documentPlayerWrapperRef]
  );

  const handleClose = useCallback(() => {
    setDocumentOverviewActive(false);
  }, [setDocumentOverviewActive]);

  /**
   * VideoArea is rendered as a WrapperElem scale (same as the background image region)
   */
  const videoAreaStyle = useMemo<CSSProperties>(() => {
    if (!videoViewport || !containerRef.current) return {};

    const [topPct, leftPct, widthPct, heightPct] =
      cvtToTLWHArray(videoViewport);

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    return {
      top: topPct * containerHeight,
      left: leftPct * containerWidth,
      width: widthPct * containerWidth,
      height: heightPct * containerHeight * 2,
    };
  }, [videoViewport, containerRef]);

  const calcWrapperScrollYAdjustmentDelta = useCallback(
    (
      documentAreaHeightPx: number,
      documentAreaTopPct: number,
      wrapperHeight: number,
      containerHeight: number
    ) =>
      documentAreaTopPct *
      (documentAreaHeightPx + (containerHeight - wrapperHeight)),
    []
  );

  const documentAreaStyle = useMemo<CSSProperties>(() => {
    if (!userDocumentViewport || !wrapperRef.current || !containerRef.current)
      return {};

    const [topPct, leftPct, widthPct, heightPct] =
      cvtToTLWHArray(userDocumentViewport);

    /** Update wrapperRef.current.scrollTop to keep the documentArea in the viewport */
    wrapperRef.current.scrollTop = calcWrapperScrollYAdjustmentDelta(
      heightPct * wrapperRef.current.scrollHeight,
      topPct,
      wrapperRef.current.clientHeight,
      containerRef.current.clientHeight
    );

    return {
      left: leftPct * wrapperRef.current.clientWidth,
      top: topPct * containerRef.current.clientHeight,
      width: widthPct * containerRef.current.clientWidth,
      height: heightPct * wrapperRef.current.scrollHeight,
    };
  }, [
    userDocumentViewport,
    wrapperRef,
    containerRef,
    calcWrapperScrollYAdjustmentDelta,
  ]);

  useEffect(() => {
    if (
      !documentPlayerActive &&
      documentOverviewActive &&
      !standaloneModeEnabled
    )
      handleClose();
  }, [
    documentPlayerActive,
    documentOverviewActive,
    handleClose,
    standaloneModeEnabled,
  ]);

  const componentVisible = documentOverviewActive || standaloneModeEnabled;

  return (
    <div
      id="document_overview_wrapper"
      className={`overflow-hidden select-none w-full h-full bg-black-transparent-01`}
      style={{
        position: !standaloneModeEnabled ? "absolute" : "relative",
        width: !standaloneModeEnabled ? "100%" : widthPx + "px",
        top: 0,
        left: 0,
        pointerEvents: componentVisible ? "auto" : "none",
        zIndex: zIndex ?? "auto",
        transition: "background 0.2s ease-in-out",
        visibility: componentVisible ? "visible" : "hidden",
      }}
      ref={wrapperRef}
      onWheel={handleWheel}
      onClick={handleClose}
    >
      <div
        id="document_overview_container"
        className="relative select-none z-10"
        style={{
          width: widthPx + "px",
          height: "100%",
          transition: "opacity 0.2s ease-in-out",
          opacity: componentVisible ? 1 : 0,
        }}
        {...handlers}
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        <img className="w-full pointer-events-none" src={imagedPdfSrc ?? ""} />
      </div>
      <div
        className="absolute flex-xyc doc-overview-invid-focused-area bg-blue-600 z-10 opacity-70 pointer-events-none"
        style={videoAreaStyle}
      >
        <FontAwesomeIcon className="text-4xl text-white" icon={faPlay} />
      </div>
      <div
        className="absolute flex-xyc flex-col doc-overview-indoc-focused-area bg-red-600 z-10 opacity-70 pointer-events-none"
        style={documentAreaStyle}
      >
        <FontAwesomeIcon className="text-4xl text-white" icon={faFileInvoice} />
      </div>
    </div>
  );
};

export const DocumentOverview = React.memo(_DocumentOverview);
