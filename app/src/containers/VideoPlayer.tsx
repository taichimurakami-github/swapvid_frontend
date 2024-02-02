import React, { useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai/react";
import {
  assetLoaderStateAtom,
  sequenceAnalyzerEnabledAtom,
  videoCurrentTimeAtom,
  videoElementRefAtom,
  videoElementStateAtom,
  videoMetadataAtom,
  videoPlayerLayoutAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useDesktopCapture } from "@/hooks/useDesktopCapture";
import { useAutoVideoSrcInjecter } from "@/hooks/useVideoSrcHelper";

/**
 * Should not use "useCallback" in this component,
 * because it won't be re-rendered so frequently.
 */
const _VideoPlayer: React.FC<{
  desktopCaptureEnabled?: boolean;
  playerWidth?: number;
  playerHeight?: number;
}> = ({ desktopCaptureEnabled, playerWidth, playerHeight }) => {
  const errorContent = useRef("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useAtom(videoSrcAtom);
  const setVideoElementRef = useSetAtom(videoElementRefAtom);
  const setVideoPlayerLayout = useSetAtom(videoPlayerLayoutAtom);
  const setVideoElementState = useSetAtom(videoElementStateAtom);
  const setVideoMetadata = useSetAtom(videoMetadataAtom);
  const setAssetLoaderState = useSetAtom(assetLoaderStateAtom);
  const setSequenceAnalyzerEnabled = useSetAtom(sequenceAnalyzerEnabledAtom);
  const setVideoCurrentTime = useSetAtom(videoCurrentTimeAtom);

  const captureDesktop = useDesktopCapture();

  const handleOnLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const duration = e.currentTarget.duration;
    const live = e.currentTarget.duration === Infinity;
    const resolution = [
      e.currentTarget.videoWidth,
      e.currentTarget.videoHeight,
    ] as [number, number];

    setVideoMetadata({
      resolution,
      live,
      duration,
    });
  };

  const handleOnVolumeChange = () => {
    if (videoRef.current) {
      setVideoElementState((b) => ({
        ...b,
        volume: videoRef.current?.volume ?? b.volume,
      }));
    }
  };

  const handleOnLoadedData = () => {
    setVideoElementState((b) => ({
      ...b,
      loaded: true,
      volume: videoRef.current?.volume ?? b.volume,
    }));
  };

  const handleOnPlay = () => {
    setVideoElementState((b) => ({ ...b, paused: false }));
  };

  const handleOnPause = () => {
    setVideoElementState((b) => ({ ...b, paused: true }));
  };

  const handleOnClick = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
    e.preventDefault();
    e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause();
  };

  const handleOnResize = () => {
    if (videoRef.current) {
      setVideoElementRef(videoRef);

      videoRef.current &&
        setVideoPlayerLayout({
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        });
    }
  };

  const handleOnLoadError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    errorContent.current =
      e.currentTarget.error?.message ?? "Video loading error.";
  };

  const handleCaptureDesktop = async () => {
    const result = await captureDesktop();

    if (result) {
      setVideoSrc(result.captureStream);
      setAssetLoaderState((b) => ({
        ...b,
        video: { presetsEnabled: false, sourceType: "streaming" },
      }));
      setSequenceAnalyzerEnabled(true);
    }
  };

  const handleOnTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoCurrentTime(e.currentTarget.currentTime);
  };

  useAutoVideoSrcInjecter(videoRef, videoSrc);

  useEffect(() => {
    videoRef.current &&
      setVideoPlayerLayout((b) => ({
        ...b,
        width: videoRef.current?.clientWidth ?? b.width,
        height: videoRef.current?.clientHeight ?? b.height,
      }));
  }, [
    setVideoPlayerLayout,
    videoSrc,
    videoRef.current?.clientWidth,
    videoRef.current?.clientHeight,
  ]);

  if (errorContent.current) throw new Error(errorContent.current);

  /**
   * Must set max-width and max-height to video element
   * to keep it in viewport.
   */
  return (
    <>
      {!videoSrc &&
        (desktopCaptureEnabled ? (
          <div className="flex-xyc flex-col gap-4 w-[1000px] h-[500px] bg-gray-300">
            <p className="text-xl">
              Please choose app window from your desktop.
            </p>
            <button
              className="py-2 px-4 rounded-full bg-teal-600 hover:bg-teal-700 font-bold text-white text-2xl"
              onClick={handleCaptureDesktop}
            >
              Capture Desktop
            </button>
          </div>
        ) : (
          <div className="flex-xyc flex-col gap-4 w-[1000px] h-[500px] max-w-full max-h-full bg-gray-700 text-white font-bold">
            <p className="text-2xl">Cannot find the video file.</p>
            <p>Please choose the assets from Config to play.</p>
          </div>
        ))}
      <video
        className="max-w-[90vw] max-h-[80vh] bg-gray-200"
        style={{
          display: videoSrc ? "block" : "none",
          width: playerWidth ?? "100%",
          height: playerHeight ?? "auto",
        }}
        ref={videoRef}
        loop={false}
        autoPlay={true}
        onError={handleOnLoadError}
        onInvalid={(e) => {
          console.log(e);
        }}
        onLoadedMetadata={handleOnLoadedMetadata}
        onLoadedData={handleOnLoadedData}
        onClick={handleOnClick}
        onPause={handleOnPause}
        onPlay={handleOnPlay}
        onVolumeChange={handleOnVolumeChange}
        onResize={handleOnResize}
        onTimeUpdate={handleOnTimeUpdate}
      />
    </>
  );
};

export const VideoPlayer = React.memo(_VideoPlayer);
