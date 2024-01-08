import React, { useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import {
  mediaSourceTypeAtom,
  sequenceAnalyzerEnabledAtom,
  videoElementRefAtom,
  videoElementStateAtom,
  videoMetadataAtom,
  videoPlayerLayoutAtom,
  videoSrcAtom,
  videoSrcObjectAtom,
} from "@/providers/jotai/swapVidPlayer";
import { useDesktopCapture } from "@/hooks/useDesktopCapture";

/**
 * Should not use "useCallback" in this component,
 * because it won't be re-rendered so frequently.
 */
const _VideoPlayer: React.FC<{ desktopCaptureEnabled?: boolean }> = ({
  desktopCaptureEnabled,
}) => {
  const errorContent = useRef("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = useAtomValue(videoSrcAtom);
  const [videoSrcObject, setVideoSrcObject] = useAtom(videoSrcObjectAtom);
  const setVideoElementRef = useSetAtom(videoElementRefAtom);
  const setVideoPlayerLayout = useSetAtom(videoPlayerLayoutAtom);
  const setVideoElementState = useSetAtom(videoElementStateAtom);
  const setVideoMetadata = useSetAtom(videoMetadataAtom);
  const setMediaSourceType = useSetAtom(mediaSourceTypeAtom);
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
      setVideoSrcObject(result.captureStream);
      setMediaSourceType("live-streaming");
      setSequenceAnalyzerEnabled(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const videoElem = videoRef.current;
      if (desktopCaptureEnabled) {
        videoElem.srcObject = videoSrcObject;
        return () => {
          videoElem.srcObject = null;
        };
      }

      if (videoSrc) {
        videoRef.current.src = videoSrc;
      }
    }
  }, [videoSrc, desktopCaptureEnabled, videoSrcObject, videoRef]);

  if (errorContent.current) throw new Error(errorContent.current);

  if (!desktopCaptureEnabled && !videoSrc) {
    return (
      <div className="flex-xyc bg-gray-300 text-2xl font-bold w-[1000px]">
        Failed to load media : Video source is not found.
      </div>
    );
  }

  const videoReady =
    (!desktopCaptureEnabled && !!videoSrc) ||
    (desktopCaptureEnabled && !!videoSrcObject);

  return (
    <>
      {desktopCaptureEnabled && !videoReady && (
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

      {!desktopCaptureEnabled && !videoReady && (
        <div className="flex-xyc bg-gray-300 text-2xl font-bold w-[1000px]">
          Failed to load media : Video source is not found.
        </div>
      )}

      <video
        className="max-h-[75vh] max-w-[100%] w-full"
        style={{
          display: videoReady ? "block" : "none",
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
