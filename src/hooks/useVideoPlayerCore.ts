import React, { useCallback } from "react";
import { useKeyboardInputForVideoPlayer } from "@hooks/useKeyboardInput";
import {
  useAssetDataCtx,
  useDispatchVideoPlayerStateCtx,
  useVideoPlayerStateCtx,
} from "./useContextConsumer";

export function useVideoPlayerCore(
  videoRefStore: React.RefObject<HTMLVideoElement>
) {
  const videoPlayerState = useVideoPlayerStateCtx();
  const dispatchVideoPlayerState = useDispatchVideoPlayerStateCtx();

  // アセットデータの読み込み
  const { videoPlayerAssets } = useAssetDataCtx();
  const assetDataState = videoPlayerAssets;

  const handleOnPause = useCallback(() => {
    if (!dispatchVideoPlayerState) return;
    dispatchVideoPlayerState({ type: "update_paused", value: true });
  }, []);

  const handleOnPlay = useCallback(() => {
    if (!dispatchVideoPlayerState) return;
    dispatchVideoPlayerState({ type: "update_paused", value: false });
  }, []);

  const handleOnWating = useCallback(() => {
    if (!dispatchVideoPlayerState) return;
    dispatchVideoPlayerState({ type: "update_loading", value: true });
  }, []);

  const handleOnCanPlay = useCallback(() => {
    if (!dispatchVideoPlayerState) return;

    dispatchVideoPlayerState({ type: "update_loaded", value: false });
  }, []);

  const handleOnLoadedData = useCallback(() => {
    if (!dispatchVideoPlayerState) return;

    const video = videoRefStore.current as HTMLVideoElement;
    dispatchVideoPlayerState({
      type: "update",
      value: {
        loaded: true,
        width: video.clientWidth,
        height: video.clientHeight,
      },
    });
    // setVideoPlayerState((b: TVideoPlayerState) => ({
    //   ...b,
    //   loaded: true,
    //   width: video.clientWidth,
    //   height: video.clientHeight,
    // }));
  }, []);

  const handleOnClick = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
    const video = e.currentTarget;
    const nextVideoPausedValue = !video.paused;

    nextVideoPausedValue ? video.pause() : video.play();
  }, []);

  const handleVideoElementMuted = useCallback(
    (nextVideoElementMuted: boolean) => {
      if (!videoRefStore.current || !dispatchVideoPlayerState) {
        return;
      }
      videoRefStore.current.muted =
        nextVideoElementMuted ?? !videoRefStore.current.muted;

      dispatchVideoPlayerState({
        type: "update_muted",
        value: (videoRefStore.current as HTMLVideoElement).muted,
      });
    },
    []
  );

  const handleVideoElementPaused = useCallback(
    (nextVideoElementPaused: boolean) => {
      if (!videoRefStore.current || !dispatchVideoPlayerState) {
        return;
      }
      nextVideoElementPaused
        ? videoRefStore.current.pause()
        : videoRefStore.current.play();

      dispatchVideoPlayerState({
        type: "update_paused",
        value: (videoRefStore.current as HTMLVideoElement).paused,
      });
    },
    []
  );

  const handleVideoSubtitlesActive = useCallback(
    (nextSubtitlesActive: boolean) => {
      if (!dispatchVideoPlayerState) return;
      dispatchVideoPlayerState({
        type: "update_subtitles_active",
        value: nextSubtitlesActive,
      });

      // setVideoPlayerState((b) => ({
      //   ...b,
      //   subtitlesActive: nextSubtitlesActive,
      // }));
    },
    []
  );

  // キーボードショートカットの設定
  useKeyboardInputForVideoPlayer(videoRefStore);

  return {
    videoPlayerState,
    videoRefStore,
    assetDataState,
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
