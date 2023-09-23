import {
  useDocumentPlayerStateCtx,
  useVideoPlayerStateCtx,
} from "@/hooks/useContextConsumer";
import { faFileInvoice, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

export default function DocumentOverviewContainer(
  props: PropsWithChildren<{ active: boolean; height?: string }>
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const documentViewportAreaRef = useRef<HTMLDivElement>(null);
  const videoViewportAreaRef = useRef<HTMLDivElement>(null);
  const backgroundImgRef = useRef<HTMLImageElement>(null);

  const [documentAreaStyle, setDocumentAreaStyle] = useState<CSSProperties>({});

  const documentPlayerState = useDocumentPlayerStateCtx();
  const videoPlayerState = useVideoPlayerStateCtx();

  const videoArea: { [key: string]: number | null } = {
    left: null,
    top: null,
    right: null,
    bottom: null,
  };

  if (documentPlayerState.videoOnFocusArea) {
    videoArea.left = documentPlayerState.videoOnFocusArea[0][0];
    videoArea.top = documentPlayerState.videoOnFocusArea[0][1];
    videoArea.right = documentPlayerState.videoOnFocusArea[1][0];
    videoArea.bottom = documentPlayerState.videoOnFocusArea[1][1];
  }

  /**
   * VideoArea is rendered as a WrapperElem scale (same as the background image region)
   */

  const videoOnFocusAreaStyles =
    videoArea.top !== null &&
    videoArea.left !== null &&
    videoArea.right !== null &&
    videoArea.bottom !== null &&
    backgroundImgRef.current
      ? {
          top: videoArea.top * backgroundImgRef.current.clientHeight,
          left: videoArea.left * backgroundImgRef.current.clientWidth,
          width:
            (videoArea.right - videoArea.left) *
            backgroundImgRef.current.clientWidth,
          height:
            (videoArea.bottom - videoArea.top) *
            backgroundImgRef.current.clientHeight,
        }
      : {};

  useEffect(() => {
    /**
     * DocumentArea is rendered as a VideoArea scale
     */

    const documentAreaLeft = documentPlayerState.documentOnFocusArea[0][0];
    const documentAreaTop = documentPlayerState.documentOnFocusArea[0][1];
    const documentAreaRight = documentPlayerState.documentOnFocusArea[1][0];
    const documentAreaBottom = documentPlayerState.documentOnFocusArea[1][1];

    const documentAreaWidth = wrapperRef.current
      ? (documentAreaRight - documentAreaLeft) * wrapperRef.current.clientWidth
      : 0;

    const documentAreaHeight =
      documentAreaWidth * (videoPlayerState.height / videoPlayerState.width);

    const [x_r, y_r] = [documentAreaLeft, documentAreaTop];

    if (backgroundImgRef.current && wrapperRef.current) {
      console.log(
        wrapperRef.current.clientHeight,
        documentAreaTop * wrapperRef.current.clientHeight
      );
      setDocumentAreaStyle({
        left: documentAreaLeft * wrapperRef.current.clientWidth, //x
        // top: documentAreaTop * 100 + "%", //y
        top: documentAreaTop * backgroundImgRef.current.clientHeight,
        width: documentAreaWidth,
        height: documentAreaHeight,
      });

      wrapperRef.current.scrollTop =
        documentAreaTop *
        (backgroundImgRef.current.clientHeight -
          wrapperRef.current.clientHeight);
    }
  }, [documentPlayerState.documentOnFocusArea]);

  useEffect(() => {
    if (wrapperRef.current) {
      const listener = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      wrapperRef.current.addEventListener("wheel", listener, {
        passive: false,
      });

      return wrapperRef.current.removeEventListener("wheel", listener);
    }
  }, [wrapperRef.current]);

  return (
    <div
      id="document_overview_container_wrapper"
      className="relative overflow-hidden scrollbar-hidden"
      style={{
        visibility: props.active ? "visible" : "hidden",
        height: props.height ?? "100%",
      }}
      ref={wrapperRef}
    >
      <img
        className="w-full select-none"
        src={documentPlayerState.baseImgSrc}
        ref={backgroundImgRef}
      />
      <div
        className="absolute flex-xyc doc-overview-invid-focused-area bg-blue-600 z-10 opacity-70"
        ref={videoViewportAreaRef}
        style={
          videoOnFocusAreaStyles
          // {
          // top: focusedAreaStyles.inVidFocusedTop,
          // width: focusedAreaStyles.width,
          // height: focusedAreaStyles.inVidFocusedHeight,
          // }
        }
      >
        <FontAwesomeIcon className="text-4xl text-white" icon={faPlay} />
      </div>
      <div
        className="absolute flex-xyc flex-col doc-overview-indoc-focused-area bg-red-600 z-10 opacity-70"
        ref={documentViewportAreaRef}
        style={
          documentAreaStyle
          //   {
          //   top: focusedAreaStyles.inDocFocusedTop,
          //   width: focusedAreaStyles.width,
          //   height: focusedAreaStyles.inDocFocusedHeight,
          //   visibility: documentPlayerState.active ? "visible" : "hidden",
          // }
        }
      >
        <FontAwesomeIcon className="text-4xl text-white" icon={faFileInvoice} />
      </div>
    </div>
  );
}
