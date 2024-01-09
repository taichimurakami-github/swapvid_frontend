import React, { useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai/react";
import {
  assetLoaderStateAtom,
  sequenceAnalyzerEnabledAtom,
  videoElementRefAtom,
  videoElementStateAtom,
  videoMetadataAtom,
  videoPlayerLayoutAtom,
  videoSrcAtom,
} from "@/providers/jotai/swapVidPlayer";
import { useDesktopCapture } from "@/hooks/useDesktopCapture";
import { useVideoSrcSetter } from "@/hooks/useVideoSrcSetter";

/**
 * Should not use "useCallback" in this component,
 * because it won't be re-rendered so frequently.
 */
const _VideoPlayer: React.FC<{ desktopCaptureEnabled?: boolean }> = ({
  desktopCaptureEnabled,
}) => {
  const errorContent = useRef("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useAtom(videoSrcAtom);
  const setVideoElementRef = useSetAtom(videoElementRefAtom);
  const setVideoPlayerLayout = useSetAtom(videoPlayerLayoutAtom);
  const setVideoElementState = useSetAtom(videoElementStateAtom);
  const setVideoMetadata = useSetAtom(videoMetadataAtom);
  const setAssetLoaderState = useSetAtom(assetLoaderStateAtom);
  const setSequenceAnalyzerEnabled = useSetAtom(sequenceAnalyzerEnabledAtom);

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

  const handleSetVideoSrc = useVideoSrcSetter();

  useEffect(() => {
    handleSetVideoSrc(videoSrc, videoRef);
  }, [videoSrc, handleSetVideoSrc, videoRef]);

  if (errorContent.current) throw new Error(errorContent.current);

  return (
    <>
      {desktopCaptureEnabled && !videoSrc && (
        <div className="flex-xyc flex-col gap-4 w-[1000px] h-[500px] bg-gray-300">
          <p className="text-xl">Please choose app window from your desktop.</p>
          <button
            className="py-2 px-4 rounded-full bg-teal-600 hover:bg-teal-700 font-bold text-white text-2xl"
            onClick={handleCaptureDesktop}
          >
            Capture Desktop
          </button>
        </div>
      )}

      {!desktopCaptureEnabled && !videoSrc && (
        <div className="flex-xyc flex-col gap-4 w-[1000px] h-[500px] bg-gray-300">
          <b className="text-2xl">
            <span className="text-red-700">Cannot find the video file.</span>{" "}
            Please select it.
          </b>
          <button
            className="py-2 px-4 rounded-full bg-teal-600 hover:bg-teal-700 font-bold text-white text-2xl"
            onClick={handleCaptureDesktop}
          >
            Select Video File
          </button>
        </div>
      )}

      <video
        className="max-h-[75vh] max-w-[100%] w-full"
        style={{
          display: videoSrc ? "block" : "none",
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
      />
    </>
  );
};

export const VideoPlayer = React.memo(_VideoPlayer);
