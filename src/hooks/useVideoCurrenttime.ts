import React, { useEffect, useRef, useState } from "react";

const INTERVAL_TIME_MS = 250;

export function useVideoCurrenttime(videoElement: HTMLVideoElement | null) {
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const _beforeUpdatedTime_ns = useRef(0);

  useEffect(() => {
    if (videoElement) {
      videoElement.addEventListener("timeupdate", (e) => {
        if (!e.currentTarget) return;

        // Depress time update event by INTERVAL_TIME_MS
        const now_ns = Date.now();
        if (now_ns - _beforeUpdatedTime_ns.current >= INTERVAL_TIME_MS) {
          // update before updated time cache
          _beforeUpdatedTime_ns.current = now_ns;

          // update currentTime state
          const _video = e.currentTarget as HTMLVideoElement;
          setVideoCurrentTime(_video.currentTime);
        }
      });
    }
  }, [videoElement]);

  return videoCurrentTime;
}
