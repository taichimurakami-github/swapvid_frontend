import React, { createContext, PropsWithChildren, useReducer } from "react";
import {
  videoCropAreaReducerActions,
  videoCropAreaReducer,
} from "@/providers/reducers/videoCropArea";
import {
  videoPlayerStateReducer,
  videoPlayerStateReducerActions,
} from "@/providers/reducers/videoPlayerState";
import { DOMRectLike } from "@/types/swapvid";

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

export type TDispatchVideoPlayerStateCtx =
  null | React.Dispatch<videoPlayerStateReducerActions>;

export type TDispatchVideoCropAreaCtx =
  null | React.Dispatch<videoCropAreaReducerActions>;

const initialVideoPlayerState = {
  src: "",
  width: 0,
  height: 0,
  paused: true,
  loading: true,
  loaded: false,
  muted: false,
  subtitlesActive: true,
};

const initialVideoCropArea = null;

export const VideoPlayerStateCtx = createContext<TVideoPlayerState>(
  initialVideoPlayerState
);

export const DispatchVideoPlayerStateCtx =
  createContext<TDispatchVideoPlayerStateCtx>(null);

export const VideoCropAreaCtx = createContext<TVideoCropArea>(null);

export const DispatchVideoCropAreaCtx =
  createContext<TDispatchVideoCropAreaCtx>(null);

export default function VideoPlayerCtxProvider(
  props: PropsWithChildren<{
    src?: string;
    muted?: boolean;
    autoplay?: boolean;
    width?: number;
    height?: number;
  }>
) {
  const [videoPlayerState, dispatchVideoPlayerState] = useReducer(
    videoPlayerStateReducer,
    initialVideoPlayerState
  );

  const [videoCropArea, dispatchVideoCropArea] = useReducer(
    videoCropAreaReducer,
    initialVideoCropArea
  );

  return (
    <DispatchVideoPlayerStateCtx.Provider value={dispatchVideoPlayerState}>
      <VideoPlayerStateCtx.Provider value={videoPlayerState}>
        <DispatchVideoCropAreaCtx.Provider value={dispatchVideoCropArea}>
          <VideoCropAreaCtx.Provider value={videoCropArea}>
            {props.children}
          </VideoCropAreaCtx.Provider>
        </DispatchVideoCropAreaCtx.Provider>
      </VideoPlayerStateCtx.Provider>
    </DispatchVideoPlayerStateCtx.Provider>
  );
}
