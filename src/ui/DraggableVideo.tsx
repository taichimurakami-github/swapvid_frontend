import React, { PropsWithChildren, useRef, useState } from "react";
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
const DraggableVideo = React.memo(function _DraggableVideo(
  props: PropsWithChildren<{
    active: boolean;
    videoElement: HTMLVideoElement | null;
    movieSrc: string;
    onHandleClick?: () => void;
    onHandleClose?: () => void;
  }>
) {
  const CLOSE_BTN_OPACITY = {
    unactive: 0,
    visible: 50,
    active: 100,
  };

  const smallVideoRef = useRef<HTMLVideoElement>(null);
  const videoCurrentTime = useVideoCurrenttime(props.videoElement);
  const eventHandlers = useHandleClickWithDrag(props.onHandleClick, 200);
  const wrapperElemRef = useRef(null);

  const [closeBtnOpacity, setCloseBtnOpacity] = useState(0);

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
        onPointerEnter={() => {
          setCloseBtnOpacity(CLOSE_BTN_OPACITY.visible);
        }}
        onPointerLeave={() => {
          setCloseBtnOpacity(CLOSE_BTN_OPACITY.unactive);
        }}
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
        {closeBtnOpacity > 0 && (
          <div
            className="absolute top-[3%] right-[3%] flex-xyc rounded-full bg-slate-600 w-[3rem] h-[3rem] text-white text-3xl font-bold"
            style={{
              opacity: `${closeBtnOpacity}%`,
            }}
            onPointerEnter={() => {
              setCloseBtnOpacity(CLOSE_BTN_OPACITY.active);
            }}
            onPointerLeave={() => {
              setCloseBtnOpacity(CLOSE_BTN_OPACITY.visible);
            }}
            onClick={props.onHandleClose}
          >
            <div className="relative w-full h-full">
              <span className="absolute rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block bg-white w-[60%] h-[5px]"></span>
              <span className="absolute -rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block bg-white w-[60%] h-[5px]"></span>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
});

export default DraggableVideo;
