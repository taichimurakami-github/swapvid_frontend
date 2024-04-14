import { useCallback } from "react";

export function useDesktopCapture() {
  const captureDesktop = useCallback(async () => {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      return {
        captureSettings: captureStream.getVideoTracks()[0].getSettings(),
        captureStream,
      };
    } catch (e) {
      console.log(e);
    }
  }, []);

  return captureDesktop;
}
