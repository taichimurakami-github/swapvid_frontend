import React, { useRef } from "react";

export default function usePreviewDummyVideo(
  srcVideoElementId: string,
  previewTime_sec: number,
  updateInterval_sec: number
) {
  const beforePreviewedTime = useRef(0);

  const isTimeToUpdate =
    updateInterval_sec <
    Math.abs(previewTime_sec - beforePreviewedTime.current);

  if (isTimeToUpdate) {
    beforePreviewedTime.current = previewTime_sec;
    const video = document.getElementById(
      srcVideoElementId
    ) as HTMLVideoElement | null;

    if (video) {
      video.currentTime = previewTime_sec;
    }
  }
}
