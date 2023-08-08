import React, { createContext, PropsWithChildren, useState } from "react";

export type TVideoPlayerState = {
  // ready: boolean;
  src: string;
  width: number;
  height: number;
  paused: boolean;
  loading: boolean;
  muted: boolean;
  subtitlesActive: boolean;
  loaded: boolean;
};

export type TVideoPlayerStateHandlerCtx = {
  setVideoPlayerState: React.Dispatch<React.SetStateAction<TVideoPlayerState>>;
};

export const VideoPlayerStateCtx =
  //@ts-ignore : 初期値を無視するためのts-ignore
  createContext<TVideoPlayerState>();

export const SetVideoPlayerStateCtx =
  //@ts-ignore : 初期値を無視するためのts-ignore
  createContext<TVideoPlayerStateHandlerCtx>();

export default function VideoPlayerCtxProvider(
  props: PropsWithChildren<{
    src?: string;
    muted?: boolean;
    autoplay?: boolean;
    width?: number;
    height?: number;
  }>
) {
  const [videoPlayerState, setVideoPlayerState] = useState<TVideoPlayerState>({
    src: "",
    width: 0,
    height: 0,
    paused: true,
    loading: true,
    loaded: false,
    muted: false,
    subtitlesActive: true,
  });

  return (
    <SetVideoPlayerStateCtx.Provider value={{ setVideoPlayerState }}>
      <VideoPlayerStateCtx.Provider value={videoPlayerState}>
        {props.children}
      </VideoPlayerStateCtx.Provider>
    </SetVideoPlayerStateCtx.Provider>
  );
}
