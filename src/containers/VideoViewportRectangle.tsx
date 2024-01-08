import React from "react";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtomValue } from "jotai/react";
import {
  documentPlayerActiveAtom,
  videoViewportAtom,
} from "@/providers/jotai/swapVidPlayer";
import { cvtToTLWHArray } from "@/utils/bboxUtil";

export const VideoViewportRectangle: React.FC<{ pageWidthPx: number }> =
  React.memo(({ pageWidthPx }) => {
    const videoViewport = useAtomValue(videoViewportAtom);
    const documentPlayerActive = useAtomValue(documentPlayerActiveAtom);

    if (!videoViewport) {
      return <></>;
    }

    const [areaTop, areaLeft, areaWidth, areaHeight] =
      cvtToTLWHArray(videoViewport);

    const areaPosition = {
      // X direction:  Set the position in relative scale
      left: areaLeft * pageWidthPx + "px",
      width: areaWidth * pageWidthPx + "px",

      // Y direction : Set the position in relative scale
      top: areaTop * 100 + "%",
      height: areaHeight * 100 + "%",
    };

    return (
      <div
        id="video_viewport_rectangle"
        className="absolute w-full h-full top-0 left-0 pointer-events-none"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute py-2 px-3 top-0 left-0 doc-overview-invid-focused-area border-8 rounded-md border-blue-600 z-10"
            style={{
              ...areaPosition,
              transition: "all 0.75s ease-in",
              opacity: documentPlayerActive ? 0.4 : 0,
            }}
          >
            <FontAwesomeIcon className="text-4xl text-blue-600" icon={faPlay} />
          </div>
        </div>
      </div>
    );
  });
