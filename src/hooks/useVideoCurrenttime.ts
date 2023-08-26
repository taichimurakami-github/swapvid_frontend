import React, { useEffect, useRef, useState } from "react";

export function useVideoCurrenttime(
  videoElement: HTMLVideoElement | null,
  interval_to_update_ms = 250
) {
  const [videoCurrentTime, setVideoCurrentTime] = useState(
    videoElement ? videoElement.currentTime : 0
  );
  const _beforeUpdatedTime_ns = useRef(0);

  useEffect(() => {
    if (videoElement) {
      videoElement.addEventListener("timeupdate", (e) => {
        if (!e.currentTarget) return;

        // Depress time update event by INTERVAL_TIME_MS
        const now_ns = Date.now();
        if (now_ns - _beforeUpdatedTime_ns.current >= interval_to_update_ms) {
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
