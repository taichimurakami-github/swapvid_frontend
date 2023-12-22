import React from "react";
import useVideoSeekbar from "@hooks/useVideoSeekbar";
import { useVideoCurrenttime } from "@hooks/useVideoCurrenttime";

import SeekbarHighlightContainer from "@containers/SeekbarHighlightContainer";

import { getHMFormatCurrentTime } from "@utils/getHMFormatCurrentTime";
import { UIELEM_ID_LIST } from "@/app.config";
import usePreviewDummyVideo from "@hooks/usePreviewDummyVideo";

export default function VideoSeekbar(props: {
  active: boolean;
  videoElement: HTMLVideoElement;
  documentPlayerActive: boolean;
  // documentActiveTimes: [number, number, number][];
  zIndex?: number;
  disableSeekbarHighlight?: boolean;
  disableViewportEffectOnSeekbarHighlight?: boolean;
  onHandleSetPlayerActive: (v: boolean) => void;
}) {
  const currentTime = useVideoCurrenttime(props.videoElement);

  const {
    seekbarWrapperRef,
    seekbarHeight,
    seekbarWrapperProps,
    draggerRef,
    draggerRadius,
    draggerLeft,
    previewContainerLeft,
    // previewImgSrc,
    previewVisibility,
    previewCurrentTime_sec,
  } = useVideoSeekbar(
    props.videoElement,
    currentTime,
    false //enableLiveMode
  );

  usePreviewDummyVideo(
    UIELEM_ID_LIST.system.videoPlayer.dummyVideoElement,
    previewCurrentTime_sec,
    5
  );

  return (
    <div
      id={UIELEM_ID_LIST.system.videoPlayer.seekbarWrapper}
      className={`relative w-full flex bg-gray-400 cursor-pointer select-none`}
      ref={seekbarWrapperRef}
      style={{
        visibility: props.active ? "visible" : "hidden",
        zIndex: props.zIndex,
        height: props.active ? seekbarHeight : 0,
      }}
      onTouchStart={(e) => {
        props.onHandleSetPlayerActive(false); //シークバークリック時にdocumentPlayerを消す
        seekbarWrapperProps.onTouchStart(e);
      }}
      onMouseDown={(e) => {
        props.onHandleSetPlayerActive(false); //シークバークリック時にdocumentPlayerを消す
        seekbarWrapperProps.onMouseDown(e);
      }}
      onMouseMove={seekbarWrapperProps.onMouseMove}
      onMouseLeave={seekbarWrapperProps.onMouseLeave}
    >
      {!props.disableSeekbarHighlight && (
        <SeekbarHighlightContainer
          videoElement={props.videoElement}
          documentPlayerActive={props.documentPlayerActive}
          // documentActiveTimes={props.documentActiveTimes}
          onHandleSetDocumentPlayerActive={props.onHandleSetPlayerActive}
          disableViewportEffectOnSeekbarHighlight={
            props.disableViewportEffectOnSeekbarHighlight
          }
        ></SeekbarHighlightContainer>
      )}
      <div
        id={UIELEM_ID_LIST.system.videoPlayer.dragger}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 dragger cursor-pointer bg-white border-2 border-black rounded-full"
        ref={draggerRef}
        style={{
          width: draggerRadius,
          height: draggerRadius,
          left: draggerLeft,
        }}
      ></div>
      <div
        className="played-area bg-red-600 h-full"
        style={{
          width: draggerLeft,
        }}
      ></div>
      <div
        className="thumbnail-showcase-area absolute top-0 w-[275px] bg-gray-800 -translate-x-1/2 -translate-y-[110%] rounded-sm flex flex-col p-1 pointer-events-none"
        style={{
          left: previewContainerLeft,
          visibility: previewVisibility ? "visible" : "hidden",
        }}
      >
        <div className="relative w-full h-full">
          <video
            id={UIELEM_ID_LIST.system.videoPlayer.dummyVideoElement}
            src={props.videoElement.src}
            onClick={(e) => {
              e.preventDefault();
            }}
            muted
            width="500"
          />
          {/* <img
          className="max-h-[200px]"
          src={previewImgSrc}
          alt="preview_thumbnail"
        ></img> */}
        </div>
        <p className="text-white text-center text-xl py-2">
          {getHMFormatCurrentTime(previewCurrentTime_sec)}
        </p>
      </div>
    </div>
  );
}
