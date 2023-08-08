import { AssetDataCtx } from "@/providers/AssetDataCtxProvider";
import {
  DocumentPlayerStateCtx,
  SetDocumentPlayerStateCtx,
} from "@/providers/DocumentPlayerCtxProvider";
import {
  SetVideoPlayerStateCtx,
  VideoPlayerStateCtx,
} from "@/providers/VideoPlayerCtxProvider";
import { useContext } from "react";

export const useVideoPlayerStateCtx = () => useContext(VideoPlayerStateCtx);
export const useSetVideoPlayerStateCtx = () =>
  useContext(SetVideoPlayerStateCtx);

export const useDocumentPlayerStateCtx = () =>
  useContext(DocumentPlayerStateCtx);
export const useSetDocumentPlayerStateCtx = () =>
  useContext(SetDocumentPlayerStateCtx);

export const useAssetDataCtx = () => useContext(AssetDataCtx);
