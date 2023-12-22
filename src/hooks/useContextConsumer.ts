import { AssetDataCtx } from "@providers/AssetDataCtxProvider";
import {
  DocumentPlayerStateCtx,
  DispatchDocumentPlayerStateCtx,
  DocumentViewportCtx,
  SetDocumentViewportCtx,
  SetVideoViewportCtx,
  VideoViewportCtx,
  SeekbarActiveTimesCtx,
  SetSeekbarActiveTimesCtx,
  TSetVideoViewportCtx,
  TSetDocumentViewportCtx,
  TSetSeekbarActiveTimesCtx,
  TDispatchDocumentPlayerStateCtx,
} from "@providers/DocumentPlayerCtxProvider";
import {
  DispatchVideoCropAreaCtx,
  DispatchVideoPlayerStateCtx,
  TDispatchVideoCropAreaCtx,
  TDispatchVideoPlayerStateCtx,
  VideoCropAreaCtx,
  VideoPlayerStateCtx,
} from "@providers/VideoPlayerCtxProvider";
import { useContext } from "react";

const assertNonNullable = <NullableContextValue>(
  contextName: string,
  contextValue?: unknown
) => {
  if (!contextValue)
    throw new Error(`Null context value detected for ${contextName}.`);

  return contextValue as NonNullable<NullableContextValue>;
};

export const useVideoPlayerStateCtx = () => useContext(VideoPlayerStateCtx);

export const useDispatchVideoPlayerStateCtx = () =>
  useContext(DispatchVideoPlayerStateCtx);
// assertNonNullable<TDispatchVideoPlayerStateCtx>(
//   "DispatchVideoPlayerStateCtx",
//   useContext(DispatchVideoPlayerStateCtx)
// );

export const useVideoCropAreaCtx = () => useContext(VideoCropAreaCtx);
export const useDispatchVideoCropAreaCtx = () =>
  useContext(DispatchVideoCropAreaCtx);
// assertNonNullable<TDispatchVideoCropAreaCtx>(
//   "DispatchVideoCropAreaCtx",
//   useContext(DispatchVideoCropAreaCtx)
// );

export const useDocumentPlayerStateCtx = () =>
  useContext(DocumentPlayerStateCtx);

export const useDispatchDocumentPlayerStateCtx = () =>
  useContext(DispatchDocumentPlayerStateCtx);
// assertNonNullable<TDispatchDocumentPlayerStateCtx>(
//   "DispatchDocumentPlayerStateCtx",
//   useContext(DispatchDocumentPlayerStateCtx)
// );

export const useVideoViewportCtx = () => useContext(VideoViewportCtx);
export const useSetVideoViewportCtx = () => useContext(SetVideoViewportCtx);
// assertNonNullable<TSetVideoViewportCtx>(
//   "SetVideoViewportCtx",
//   useContext(SetVideoViewportCtx)
// );

export const useDocumentViewportCtx = () => useContext(DocumentViewportCtx);
export const useSetDocumentViewportCtx = () =>
  useContext(SetDocumentViewportCtx);
// assertNonNullable<TSetDocumentViewportCtx>(
//   "SetDocumentViewportCtx",
//   useContext(SetDocumentViewportCtx)
// );

export const useSeekbarActiveTimesCtx = () => useContext(SeekbarActiveTimesCtx);
export const useSetSeekbarActiveTimesCtx = () =>
  useContext(SetSeekbarActiveTimesCtx);
// assertNonNullable<TSetSeekbarActiveTimesCtx>(
//   "SetSeekbarActiveTimesCtx",
//   useContext(SetSeekbarActiveTimesCtx)
// );

export const useAssetDataCtx = () => useContext(AssetDataCtx);
