import React, { useCallback, useRef } from "react";

import { SeekbarHighlight } from "@containers/SeekbarHighlight";
import { SeekbarPreviewVideo } from "@/containers/SeekbarPreviewVideo";

import useVideoSeekbar from "@hooks/useVideoSeekbar";
import { useVideoCurrenttime } from "@hooks/useVideoCurrenttime";

import { formatCurrentTimeIntoHMSString } from "@/utils/formatCurrentTime";
import { useAtomValue, useSetAtom } from "jotai/react";
import {
  documentPlayerActiveAtom,
  sequenceAnalyzerEnabledAtom,
  videoElementRefAtom,
} from "@/providers/jotai/store";

export const VideoSeekbar: React.FC<{
  seekbarHighlightEnabled?: boolean;
  userViewportEffectEnabled?: boolean; // Transparent seekbar-highlighting area gradually appears/disappears according to user's document viewport
  smoothingSeekbarHighlightGapEnabled?: boolean;
  zIndex?: number;
  seekbarContainerHeightPx?: number;
  seekbarDraggerRadiusPx?: number;
}> = ({
  seekbarHighlightEnabled,
  userViewportEffectEnabled,
  smoothingSeekbarHighlightGapEnabled,
  zIndex,
  seekbarContainerHeightPx,
  seekbarDraggerRadiusPx,
}) => {
  const videoElementRef = useAtomValue(videoElementRefAtom);
  const seekbarContainerRef = useRef<HTMLDivElement>(null);
  const seekbarDraggerRef = useRef<HTMLDivElement>(null);
  const currentTime = useVideoCurrenttime(videoElementRef);
  const setDocumentPlayerActive = useSetAtom(documentPlayerActiveAtom);
  const sequenceAnalyzerEnabled = useAtomValue(sequenceAnalyzerEnabledAtom);

  const containerHeight = seekbarContainerHeightPx ?? 12;
  const draggerRadius = seekbarDraggerRadiusPx ?? containerHeight * 2;

  const {
    seekbarWrapperProps,
    draggerLeft,
    previewContainerLeft,
    // previewImgSrc,
    previewVisibility,
    currentPreviewTime_sec,
  } = useVideoSeekbar<HTMLDivElement, HTMLDivElement>(
    videoElementRef,
    seekbarContainerRef,
    seekbarDraggerRef,
    currentTime,
    false //enableLiveMode
  );

  const seekbarContainerElem = seekbarContainerRef.current;

  const clickSeekbarContainerElement = useCallback(() => {
    seekbarContainerElem && seekbarContainerElem.click();
  }, [seekbarContainerElem]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setDocumentPlayerActive(false); // Deactivate documentPlayer when seekbar is clicked
      seekbarWrapperProps.onTouchStart(e);
    },
    [setDocumentPlayerActive, seekbarWrapperProps]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setDocumentPlayerActive(false); // Deactivate documentPlayer when seekbar is clicked
      seekbarWrapperProps.onMouseDown(e);
    },
    [setDocumentPlayerActive, seekbarWrapperProps]
  );

  return (
    <div
      id="seekbar_container"
      className={`relative w-full flex bg-gray-400 cursor-pointer select-none`}
      ref={seekbarContainerRef}
      style={{
        height: containerHeight,
        zIndex: zIndex ?? "auto",
      }}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      onMouseMove={seekbarWrapperProps.onMouseMove}
      onMouseLeave={seekbarWrapperProps.onMouseLeave}
    >
      <SeekbarHighlight
        active={seekbarHighlightEnabled && !sequenceAnalyzerEnabled} // Do not show the highlights while using Sequence Analyzer
        userViewportEffectEnabled={userViewportEffectEnabled}
        smoothingSeekbarHighlightGapEnabled={
          smoothingSeekbarHighlightGapEnabled
        }
        dispatchClickEvent={clickSeekbarContainerElement}
      />
      <div
        id="seekbar_dragger"
        // className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 dragger cursor-pointer bg-white border-2 border-black rounded-full"
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 dragger cursor-pointer bg-white border-2 border-black rounded-full"
        ref={seekbarDraggerRef}
        style={{
          width: draggerRadius + "px",
          height: draggerRadius + "px",
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
        <SeekbarPreviewVideo currentPreviewTime_sec={currentPreviewTime_sec} />
        <p className="text-white text-center text-xl py-2">
          {formatCurrentTimeIntoHMSString(currentPreviewTime_sec)}
        </p>
      </div>
    </div>
  );
};
