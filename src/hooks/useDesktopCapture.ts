import React, { useCallback } from "react";

export function useDesktopCapture(videoRef: React.RefObject<HTMLVideoElement>) {
  const startCaptureDesktop = useCallback(async () => {
    try {
      const video = videoRef.current;
      if (!video) throw new Error("Cannot find video element.");

      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      video.width =
        captureStream.getVideoTracks()[0].getSettings().width ?? 1000;
      video.height =
        captureStream.getVideoTracks()[0].getSettings().height ?? 1000;
      video.srcObject = captureStream;
      video.onloadeddata = () => {
        video.play();
      };

      // console.log(captureStream);
    } catch (e) {
      console.log(e);
    }
  }, [videoRef]);

  return { startCaptureDesktop };
}
