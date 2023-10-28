import React, { useCallback } from "react";
import { useKeyboardInputForVideoPlayer } from "@/hooks/useKeyboardInput";
import {
  useAssetDataCtx,
  useSetVideoPlayerStateCtx,
  useVideoPlayerStateCtx,
} from "./useContextConsumer";
import { TVideoPlayerState } from "@/providers/VideoPlayerCtxProvider";

export function useVideoPlayerCore(
  videoRef: React.RefObject<HTMLVideoElement>
) {
  const videoPlayerState = useVideoPlayerStateCtx();
  const { setVideoPlayerState } = useSetVideoPlayerStateCtx();

  // アセットデータの読み込み
  const { videoPlayerAssets } = useAssetDataCtx();
  const assetDataState = videoPlayerAssets;

  // const _getVideoElementRef = (e: Event) => {
  //   return e.currentTarget as HTMLVideoElement;
  // };

  const handleOnPause = useCallback(() => {
    setVideoPlayerState((b: TVideoPlayerState) => ({ ...b, paused: true }));
  }, []);

  const handleOnPlay = useCallback(() => {
    setVideoPlayerState((b: TVideoPlayerState) => ({ ...b, paused: false }));
  }, []);

  const handleOnWating = useCallback(() => {
    setVideoPlayerState((b: TVideoPlayerState) => ({ ...b, loading: true }));
  }, []);

  const handleOnCanPlay = useCallback(() => {
    setVideoPlayerState((b: TVideoPlayerState) => ({ ...b, loading: false }));
  }, []);

  const handleOnLoadedData = useCallback(() => {
    const video = videoRef.current as HTMLVideoElement;
    setVideoPlayerState((b: TVideoPlayerState) => ({
      ...b,
      loaded: true,
      width: video.clientWidth,
      height: video.clientHeight,
    }));
  }, []);

  const handleOnClick = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
    const video = e.currentTarget;
    const nextVideoPausedValue = !video.paused;

    nextVideoPausedValue ? video.pause() : video.play();
  }, []);

  const handleVideoElementMuted = useCallback(
    (nextVideoElementMuted: boolean) => {
      if (!videoRef.current) {
        return;
      }
      videoRef.current.muted = nextVideoElementMuted ?? !videoRef.current.muted;
      setVideoPlayerState((s) => ({
        ...s,
        muted: (videoRef.current as HTMLVideoElement).muted,
      }));
    },
    []
  );

  const handleVideoElementPaused = useCallback(
    (nextVideoElementPaused: boolean) => {
      if (!videoRef.current) {
        return;
      }
      nextVideoElementPaused
        ? videoRef.current.pause()
        : videoRef.current.play();

      setVideoPlayerState((s) => ({
        ...s,
        paused: (videoRef.current as HTMLVideoElement).paused,
      }));
    },
    []
  );

  const handleVideoSubtitlesActive = useCallback(
    (nextSubtitlesActive: boolean) => {
      setVideoPlayerState((b) => ({
        ...b,
        subtitlesActive: nextSubtitlesActive,
      }));
    },
    []
  );

  // キーボードショートカットの設定
  useKeyboardInputForVideoPlayer(videoRef);

  return {
    videoPlayerState,
    videoRef,
    assetDataState,
    setVideoPlayerState,
    handleOnPlay,
    handleOnPause,
    handleOnClick,
    handleOnWating,
    handleOnCanPlay,
    handleOnLoadedData,
    handleVideoElementMuted,
    handleVideoElementPaused,
    handleVideoSubtitlesActive,
  };
}
