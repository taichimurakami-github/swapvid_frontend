import React, { useCallback, useEffect, useRef, useState } from "react";

export function useVideoCurrenttime(
  videoElement: HTMLVideoElement | null,
  interval_to_update_ms = 250
) {
  const [videoCurrentTime, setVideoCurrentTime] = useState(
    videoElement ? videoElement.currentTime : 0
  );
  const _beforeUpdatedTime_ns = useRef(0);

  const _handleVideoElementOnTimeUpdate = useCallback(
    (e: Event) => {
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
    },
    [interval_to_update_ms, setVideoCurrentTime]
  );

  useEffect(() => {
    videoElement &&
      videoElement.addEventListener(
        "timeupdate",
        _handleVideoElementOnTimeUpdate
      );

    return () => {
      videoElement &&
        videoElement.removeEventListener(
          "timeupdate",
          _handleVideoElementOnTimeUpdate
        );
    };
  }, [videoElement, _handleVideoElementOnTimeUpdate]);

  return videoCurrentTime;
}
