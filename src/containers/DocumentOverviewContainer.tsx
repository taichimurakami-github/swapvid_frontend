import {
  useDocumentPlayerStateCtx,
  useVideoPlayerStateCtx,
} from "@/hooks/useContextConsumer";
import { faFileInvoice, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useRef } from "react";

export default function DocumentOverviewContainer(
  props: PropsWithChildren<{ active: boolean; height?: string }>
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const documentPlayerState = useDocumentPlayerStateCtx();
  const videoPlayerState = useVideoPlayerStateCtx();
  const [vw, vh] = [videoPlayerState.width, videoPlayerState.height];

  const videoAreaLeft = documentPlayerState.videoOnFocusArea[0][0];
  const videoAreaTop = documentPlayerState.videoOnFocusArea[0][1];
  const videoAreaRight = documentPlayerState.videoOnFocusArea[1][0];
  const videoAreaBottom = documentPlayerState.videoOnFocusArea[1][1];

  const videoOnFocusAreaStyles = {
    top: videoAreaTop * 100 + "%",
    left: videoAreaLeft * 100 + "%",
    width: (videoAreaRight - videoAreaLeft) * 100 + "%",
    height: (videoAreaBottom - videoAreaTop) * 100 + "%",
  };

  const documentAreaLeft = documentPlayerState.documentOnFocusArea[0][0];
  const documentAreaTop = documentPlayerState.documentOnFocusArea[0][1];
  const documentAreaRight = documentPlayerState.documentOnFocusArea[1][0];
  const documentAreaBottom = documentPlayerState.documentOnFocusArea[1][1];

  const documentOnFocusAreaStyles = {
    top: documentAreaTop * 100 + "%",
    left: documentAreaLeft * 100 + "%",
    width: (documentAreaRight - documentAreaLeft) * 100 + "%",
    height: (documentAreaBottom - documentAreaTop) * 100 + "%",
  };

  return (
    <div
      className="relative overflow-hidden scrollbar-hidden"
      style={{
        visibility: props.active ? "visible" : "hidden",
        height: props.height ?? "100%",
      }}
      ref={wrapperRef}
    >
      <img
        className="h-full select-none"
        src={documentPlayerState.baseImgSrc}
      />
      <div
        className="absolute top-0 left-0 flex-xyc doc-overview-invid-focused-area bg-blue-600 z-10 opacity-70"
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
        className="absolute top-0 left-0 flex-xyc flex-col doc-overview-indoc-focused-area bg-red-600 z-10 opacity-70"
        style={
          documentOnFocusAreaStyles
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
