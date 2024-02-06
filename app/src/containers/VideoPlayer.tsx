import React, { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai/react";
import {
  appModalElementAtom,
  swapvidInterfaceTypeAtom,
  videoCurrentTimeAtom,
  videoElementRefAtom,
  videoElementStateAtom,
  videoMetadataAtom,
  videoPlayerLayoutAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useAutoVideoSrcInjecter } from "@/hooks/useVideoSrcHelper";
import { LocalAssetRegistrationForm } from "./LocalAssetPicker";
import { AppModalWrapper } from "@/presentations/Modal";

/**
 * Should not use "useCallback" in this component,
 * because it won't be re-rendered so frequently.
 */
const _VideoPlayer: React.FC<{
  playerWidth?: number;
  playerHeight?: number;
}> = ({ playerWidth, playerHeight }) => {
  const errorContent = useRef("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = useAtomValue(videoSrcAtom);
  const setVideoElementRef = useSetAtom(videoElementRefAtom);
  const setVideoPlayerLayout = useSetAtom(videoPlayerLayoutAtom);
  const setVideoElementState = useSetAtom(videoElementStateAtom);
  const setVideoMetadata = useSetAtom(videoMetadataAtom);
  const setVideoCurrentTime = useSetAtom(videoCurrentTimeAtom);

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

  const handleOnTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoCurrentTime(e.currentTarget.currentTime);
  };

  const handleSetVideoSrc = useAutoVideoSrcInjecter(videoRef);
  useEffect(() => {
    if (videoRef.current) {
      handleSetVideoSrc(videoSrc, videoRef.current);
    }
  }, [videoRef, handleSetVideoSrc, videoSrc]);

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

  const interfaceType = useAtomValue(swapvidInterfaceTypeAtom);

  const videoStyles =
    interfaceType === "combined"
      ? {
          maxWidth: "90vw",
          maxHeight: "80vh",
        }
      : {
          maxwidth: "100%",
          maxHeight: "auto",
        };

  const dispatchAppModalElement = useSetAtom(appModalElementAtom);

  /**
   * Must set max-width and max-height to video element
   * to keep it in viewport.
   */
  return (
    <div className="relative w-full h-full bg-gray-200">
      <video
        style={{
          display: videoSrc ? "block" : "none",
          width: playerWidth ?? "100%",
          height: playerHeight ?? "auto",
          ...videoStyles,
        }}
        ref={videoRef}
        loop={false}
        autoPlay={true}
        onError={handleOnLoadError}
        onInvalid={(e) => {
          console.log(e);
        }}
        onLoad={(e) => {
          console.log(e.currentTarget.currentTime, e.currentTarget.load);
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

      {!videoSrc && (
        <div className="p-2 flex-xyc flex-col gap-8 text-center text-2xl w-[50vw] h-[50vh]">
          <span>
            Cannot find video source.<br></br> Please select the asset files.
          </span>
          <button
            className="flex-xyc rounded-full bg-teal-600 p-4 text-white font-bold"
            onClick={() =>
              dispatchAppModalElement({
                type: "open",
                payload: (
                  <AppModalWrapper title="Asset Picker">
                    <LocalAssetRegistrationForm
                      sequenceAnalyzerToggleEnabled
                      swapVidDesktopToggleEnabled
                      handleClose={() =>
                        dispatchAppModalElement({ type: "close" })
                      }
                    />
                  </AppModalWrapper>
                ),
              })
            }
          >
            Open Asset Picker
          </button>
        </div>
      )}
    </div>
  );
};

export const VideoPlayer = React.memo(_VideoPlayer);
