import React, { PropsWithChildren, useRef } from "react";
import Draggable from "react-draggable";
import { useHandleClickWithDrag } from "@/hooks/useDraggable";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";

/**
 * Memorize component to improve performance
 *
 * ATTENTION:
 * To reset initial position to be shown,
 * please update virtual DOM by inserting and deleting DraggableVideo
 * (It wouldn't cause performance issues cause DraggableVideo uses component memorization)
 */
const DraggableVideo = React.memo(function _DraggableVideo(
  props: PropsWithChildren<{
    active: boolean;
    videoElement: HTMLVideoElement | null;
    movieSrc: string;
    onHandleClick?: () => void;
  }>
) {
  const smallVideoRef = useRef<HTMLVideoElement>(null);
  const videoCurrentTime = useVideoCurrenttime(props.videoElement);
  const eventHandlers = useHandleClickWithDrag(props.onHandleClick, 200);

  const syncParentVideoCurrentTime = (target: HTMLVideoElement) => {
    target.currentTime = videoCurrentTime;
  };

  smallVideoRef.current && syncParentVideoCurrentTime(smallVideoRef.current);

  return (
    <Draggable>
      <div
        className={`draggable-video z-30 cursor-pointer ${
          props.active ? "active" : "unactive"
        }`}
      >
        <video
          className={`relative w-full border-4`}
          src={props.movieSrc}
          width={350}
          muted
          autoPlay={false}
          ref={smallVideoRef}
          onLoadedData={(e) => {
            syncParentVideoCurrentTime(e.currentTarget);
          }}
        />
        <div
          className="_dragger-onclick-handler absolute top-0 left-0 w-full h-full"
          {...eventHandlers}
        ></div>
      </div>
    </Draggable>
  );
});

export default DraggableVideo;
