import React, { PropsWithChildren, useRef } from "react";
import Draggable from "react-draggable";
import { useHandleClickWithDrag } from "@/hooks/useDraggable";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";

export default function DraggableVideo(
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

  if (smallVideoRef.current) {
    smallVideoRef.current.currentTime = videoCurrentTime;
  }

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
        />
        <div
          className="_dragger-onclick-handler absolute top-0 left-0 w-full h-full"
          {...eventHandlers}
        ></div>
      </div>
    </Draggable>
  );
}
