import React, { useEffect, useRef } from "react";

import { videoSrcAtom } from "@/providers/jotai/swapVidPlayer";
import { useAtomValue } from "jotai/react";
import { useVideoSrcSetter } from "@/hooks/useVideoSrcSetter";

const DEFAULT_UPDATE_INTERVAL_SEC = 5;

const _SeekbarPreviewVideo: React.FC<{
  currentPreviewTime_sec: number;
  updateInterval_sec?: number;
}> = ({ currentPreviewTime_sec, updateInterval_sec }) => {
  const videoSrc = useAtomValue(videoSrcAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCurrentTime = useRef(-Infinity);

  if (
    (updateInterval_sec ?? DEFAULT_UPDATE_INTERVAL_SEC) <
    Math.abs(currentPreviewTime_sec - videoCurrentTime.current)
  ) {
    videoCurrentTime.current = currentPreviewTime_sec;
  }

  useEffect(
    () => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = videoCurrentTime.current;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoCurrentTime.current]
  );

  const handleSetVideoSrc = useVideoSrcSetter();

  useEffect(() => {
    handleSetVideoSrc(videoSrc, videoRef);
  }, [videoSrc, videoRef, handleSetVideoSrc]);

  return (
    <video
      // id={UIELEM_ID_LIST.system.videoPlayer.dummyVideoElement}
      className="pointer-events-none"
      style={{ display: videoSrc ? "block" : "none" }}
      ref={videoRef}
      muted
      width="500"
    />
  );
};

export const SeekbarPreviewVideo = React.memo(_SeekbarPreviewVideo);
