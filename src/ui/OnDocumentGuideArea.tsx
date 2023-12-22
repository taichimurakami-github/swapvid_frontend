import React, { PropsWithChildren, useRef } from "react";
import { useVideoViewportCtx } from "@hooks/useContextConsumer";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OnDocumentGuideArea(
  props: PropsWithChildren<{
    top: number | string;
    left: number | string;
    width: number | string;
    height: number | string;
    docViewerWidth: number;
    docViewerHeight: number;
    // height: number;
    active: boolean;
  }>
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoViewport = useVideoViewportCtx();

  if (!videoViewport) {
    return <></>;
  }

  const areaLeft = videoViewport[0][0];
  const areaTop = videoViewport[0][1];
  const areaRight = videoViewport[1][0];
  const areaBottom = videoViewport[1][1];

  const areaWidth = areaRight - areaLeft;
  const areaHeight = areaBottom - areaTop;

  return (
    <div
      className="relative scrollbar-hidden h-full pointer-events-none"
      style={{
        visibility:
          props.active && areaWidth > 0 && areaHeight > 0
            ? "visible"
            : "hidden",
      }}
      ref={wrapperRef}
    >
      <div
        className="absolute top-0 left-0 doc-overview-invid-focused-area border-[10px] border-blue-600 z-10 opacity-40"
        // style={guideAreaStyles}
        style={{
          top: props.top,
          left: props.left,
          width: props.width,
          height: props.height,
        }}
      >
        <div className="relative h-full">
          <FontAwesomeIcon
            className="absolute top-4 left-4 text-4xl text-blue-600"
            icon={faPlay}
          />
        </div>
      </div>
    </div>
  );
}
