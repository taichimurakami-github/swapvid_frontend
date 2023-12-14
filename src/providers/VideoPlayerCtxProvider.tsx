import { DOMRectLike } from "@/types/swapvid";
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

export type TVideoCropArea = {
  raw: DOMRectLike; // Same as DOMRect
  videoScale: DOMRectLike; // Same as DOMRect
} | null;

export type TVideoPlayerStateHandlerCtx = {
  setVideoPlayerState: React.Dispatch<React.SetStateAction<TVideoPlayerState>>;
};

export type TSetVideoCropAreaCtx = {
  setVideoCropArea: React.Dispatch<React.SetStateAction<TVideoCropArea>>;
};

export const VideoPlayerStateCtx =
  //@ts-ignore : 初期値を無視するためのts-ignore
  createContext<TVideoPlayerState>();

export const SetVideoPlayerStateCtx =
  //@ts-ignore : 初期値を無視するためのts-ignore
  createContext<TVideoPlayerStateHandlerCtx>();

export const VideoCropAreaCtx = createContext<TVideoCropArea>(null);

export const SetVideoCropAreaCtx =
  //@ts-ignore : 初期値を無視するためのts-ignore
  createContext<TSetVideoCropAreaCtx>();

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

  const [videoCropArea, setVideoCropArea] = useState<TVideoCropArea>(null);

  return (
    <SetVideoPlayerStateCtx.Provider value={{ setVideoPlayerState }}>
      <VideoPlayerStateCtx.Provider value={videoPlayerState}>
        <SetVideoCropAreaCtx.Provider value={{ setVideoCropArea }}>
          <VideoCropAreaCtx.Provider value={videoCropArea}>
            {props.children}
          </VideoCropAreaCtx.Provider>
        </SetVideoCropAreaCtx.Provider>
      </VideoPlayerStateCtx.Provider>
    </SetVideoPlayerStateCtx.Provider>
  );
}
