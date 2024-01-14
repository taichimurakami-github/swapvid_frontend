import React, { useCallback, useRef } from "react";
import Draggable from "react-draggable";
import { useHandleClickWithDrag } from "@hooks/useDraggable";
import { useVideoCurrenttime } from "@hooks/useVideoCurrenttime";
// import useIntersectionObserver from "@hooks/useIntersectionObserver";

import { useAtom, useAtomValue } from "jotai/react";
import {
  documentPlayerActiveAtom,
  pipVideoWindowActiveAtom,
  videoElementRefAtom,
  videoPlayerLayoutAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useAutoVideoSrcInjecter } from "@/hooks/useVideoSrcHelper";

/**
 * Memorize component to improve performance
 *
 * ATTENTION:
 * To reset initial position to be shown,
 * please update virtual DOM by inserting and deleting DraggableVideo
 * (It wouldn't cause performance issues cause DraggableVideo uses component memorization)
 */
const _PiPVideoWindow: React.FC<{ windowWidthPx: number; zIndex?: number }> = ({
  windowWidthPx,
  zIndex,
}) => {
  const [documentPlayerActive, setDocumentPlayerActive] = useAtom(
    documentPlayerActiveAtom
  );
  const videoPlayerLayout = useAtomValue(videoPlayerLayoutAtom);
  const videoAspectRatio = videoPlayerLayout.width / videoPlayerLayout.height;
  const pipVideoWindowActive = useAtomValue(pipVideoWindowActiveAtom);
  const videoSrc = useAtomValue(videoSrcAtom);

  const parentVideoRef = useAtomValue(videoElementRefAtom);
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  const videoCurrentTime = useVideoCurrenttime(parentVideoRef);

  const handleCloseWindow = () => setDocumentPlayerActive(false);

  const eventHandlers = useHandleClickWithDrag<HTMLDivElement>(
    handleCloseWindow,
    200
  );
  const wrapperElemRef = useRef(null);

  // FIXME: intersectionObserver doesn't work properly
  // const { intersectionEntry } = useIntersectionObserver(wrapperElemRef);

  // if (
  //   pipVideoWindowActive &&
  //   intersectionEntry &&
  //   intersectionEntry.intersectionRatio < 0.2
  // ) {
  //   handleCloseWindow();
  // }

  const parentVideoElem = parentVideoRef?.current;

  const afterAnimatedPositionTop = parentVideoElem
    ? parentVideoElem.getBoundingClientRect().bottom -
      (windowWidthPx / videoAspectRatio + 35)
    : 0;
  const afterAnimatedPositionLeft = parentVideoElem
    ? parentVideoElem.getBoundingClientRect().right - (windowWidthPx + 15)
    : 0;
  const afterAnimatedWidth = windowWidthPx;

  const parentVideoBCRect = parentVideoElem?.getBoundingClientRect();
  const initialPositionTop = parentVideoBCRect?.top ?? 0;
  const initialPositionLeft = parentVideoBCRect?.left ?? 0;
  const initialWidth = parentVideoBCRect?.width ?? 0;

  const syncParentVideoCurrentTime = useCallback(
    (targetVideo: HTMLVideoElement, currentTime: number) => {
      if (typeof videoSrc === "string") {
        targetVideo.currentTime = currentTime;
      }
    },
    [videoSrc]
  );

  useAutoVideoSrcInjecter(pipVideoRef, videoSrc);

  const componentActive =
    !documentPlayerActive || !pipVideoWindowActive || !parentVideoElem;

  const isVideoSrcObject =
    typeof videoSrc !== "string" && typeof videoSrc === "object" && !!videoSrc;

  return (
    <>
      <Draggable>
        <div
          id="pip_video_window"
          className={`pip-video-window-container fixed cursor-pointer bg-gray-600`}
          style={{
            display: componentActive ? "none" : "block",
            zIndex: zIndex ?? "auto",
            transition: "width top left 0.3s ease-in-out",
          }}
          ref={wrapperElemRef}
          {...eventHandlers}
        >
          <video
            id="pip_video"
            className={`w-full border-4`}
            muted
            autoPlay={isVideoSrcObject}
            ref={pipVideoRef}
            onLoadedData={(e) => {
              syncParentVideoCurrentTime(e.currentTarget, videoCurrentTime);
            }}
          />
        </div>
      </Draggable>

      <style>
        {`
          .pip-video-window-container {
            animation: pip-video-window-container-opening 0.5s ease-in-out forwards;
          }

          @keyframes pip-video-window-container-opening {
            0% {
              top: ${initialPositionTop}px;
              left: ${initialPositionLeft}px;
              width: ${initialWidth}px;
              opacity: 0;

              /*
                To avoid preventing user's manipulations(e.g., scroll) on documentPlayer
                while the cursor is on animated (shrinking) PiPVideoWindow.
              */
              pointer-events: none;
            }
            99% {
              top: ${afterAnimatedPositionTop}px;
              left: ${afterAnimatedPositionLeft}px;
              width: ${afterAnimatedWidth}px;
              opacity: 1;

              /* To keep user's manipulations on documentPlayer active */
              pointer-events: none;
            }
            100% {
              top: ${afterAnimatedPositionTop}px;
              left: ${afterAnimatedPositionLeft}px;
              width: ${afterAnimatedWidth}px;
              opacity: 1;

              /* To enable user's manipulations(e.g., drag, click) on PiPVideoWindow  */
              pointer-events: auto;
            }
          }
        `}
      </style>
    </>
  );
};

export const PiPVideoWindow = React.memo(_PiPVideoWindow);
