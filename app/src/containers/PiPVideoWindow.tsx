import React, { useCallback, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useHandleClickWithDrag } from "@hooks/useDraggable";
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

  const handleCloseWindow = () => setDocumentPlayerActive(false);

  const eventHandlers = useHandleClickWithDrag<HTMLDivElement>(
    handleCloseWindow,
    200
  );

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

  const syncParentVideoCurrentTime = useCallback(() => {
    if (
      pipVideoRef.current &&
      parentVideoRef?.current &&
      parentVideoRef.current.duration !== Infinity
    ) {
      pipVideoRef.current.currentTime = parentVideoRef.current.currentTime;
    }
  }, [pipVideoRef, parentVideoRef]);

  useEffect(() => {
    const timeout = setInterval(syncParentVideoCurrentTime, 1000 / 15);

    return () => clearInterval(timeout);
  }, [syncParentVideoCurrentTime]);

  const handleSetVideoSrc = useAutoVideoSrcInjecter(pipVideoRef);
  useEffect(() => {
    if (pipVideoRef.current) {
      handleSetVideoSrc(videoSrc, pipVideoRef.current);
    }
  }, [handleSetVideoSrc, videoSrc]);

  const componentActive =
    parentVideoElem && documentPlayerActive && pipVideoWindowActive;

  return (
    <>
      <Draggable>
        <div
          id="pip_video_window"
          className={`pip-video-window-container fixed cursor-pointer bg-gray-600`}
          style={{
            display: componentActive ? "" : "none",
            zIndex: zIndex ?? "auto",
            transition: "width top left 0.3s ease-in-out",
          }}
          {...eventHandlers}
        >
          <video
            id="pip_video"
            className={`w-full border-4`}
            muted
            // autoPlay={true}
            ref={pipVideoRef}
          />
        </div>
      </Draggable>

      <style>
        {`
          .pip-video-window-container {
            animation: pip-video-window-container-opening 1s ease-in-out forwards;
              pointer-events: none;
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
            50% {
              top: ${afterAnimatedPositionTop}px;
              left: ${afterAnimatedPositionLeft}px;
              width: ${afterAnimatedWidth}px;
              opacity: 0.5;

              /* To keep user's manipulations on documentPlayer active */
              pointer-events: none;
            }
            99% {
              top: ${afterAnimatedPositionTop}px;
              left: ${afterAnimatedPositionLeft}px;
              width: ${afterAnimatedWidth}px;
              opacity: 1;

              /* To enable user's manipulations(e.g., drag, click) on PiPVideoWindow  */
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
