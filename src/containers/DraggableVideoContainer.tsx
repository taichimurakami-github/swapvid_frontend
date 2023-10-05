import React, { PropsWithChildren, useRef } from "react";
import Draggable from "react-draggable";
import { useHandleClickWithDrag } from "@/hooks/useDraggable";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

/**
 * Memorize component to improve performance
 *
 * ATTENTION:
 * To reset initial position to be shown,
 * please update virtual DOM by inserting and deleting DraggableVideo
 * (It wouldn't cause performance issues cause DraggableVideo uses component memorization)
 */
const DraggableVideoContainer = React.memo(function _DraggableVideo(
  props: PropsWithChildren<{
    active: boolean;
    videoElement: HTMLVideoElement | null;
    movieSrc: string;
    onHandleClick?: () => void;
    onHandleClose?: () => void;
  }>
) {
  const smallVideoRef = useRef<HTMLVideoElement>(null);
  const videoCurrentTime = useVideoCurrenttime(props.videoElement);
  const eventHandlers = useHandleClickWithDrag(props.onHandleClick, 200);
  const wrapperElemRef = useRef(null);

  const syncParentVideoCurrentTime = (target: HTMLVideoElement) => {
    target.currentTime = videoCurrentTime;
  };

  // TODO: intersection observerw監視対象を単体のコンポーネントとして切り出す
  const { intersectionEntry } = useIntersectionObserver(wrapperElemRef);
  if (
    intersectionEntry &&
    props.onHandleClose &&
    intersectionEntry.intersectionRatio < 0.2
  ) {
    props.onHandleClose();
  }

  smallVideoRef.current && syncParentVideoCurrentTime(smallVideoRef.current);

  return (
    <Draggable>
      <div
        className={`draggable-video relative z-30 cursor-pointer ${
          props.active ? "active" : "unactive"
        }`}
        ref={wrapperElemRef}
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

export default DraggableVideoContainer;
