import React, { useEffect } from "react";

export function useKeyboardInputForVideoPlayer(
  videoRef: null | React.RefObject<HTMLVideoElement>
) {
  useEffect(() => {
    if (!videoRef) {
      return;
    }

    window.onkeydown = (e) => {
      if (!videoRef.current) {
        return;
      }
      switch (e.code) {
        case "ArrowRight": //定数秒スキップ
          videoRef.current.currentTime += 1;
          break;
        case "ArrowLeft": //低数秒巻き戻し
          videoRef.current.currentTime -= 1;
          break;

        case "Space": //一時停止・再生
          videoRef.current.paused
            ? videoRef.current.play()
            : videoRef.current.pause();
          break;

        default:
          break;
      }
    };
  }, [videoRef]);
}
