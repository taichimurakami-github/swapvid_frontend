import {
  DispatchDocumentPlayerStateCtx,
  DocumentPlayerElementCtx,
  DocumentPlayerStateCtx,
} from "@/providers/useContext/DocumentPlayerCtxProvider";
import {
  DispatchPdfPageStateCtx,
  DispatchPdfRendererStateCtx,
  PdfPageStateCtx,
  PdfRendererStateCtx,
} from "@/providers/useContext/PdfRendererCtx";
import {
  SeekbarActiveTimesCtx,
  SetSeekbarActiveTimesCtx,
} from "@/providers/useContext/SeekbarHighlightCtxProvider";
import {
  ActiveScrollTimelineCtx,
  ScrollTimelineCtx,
  SetActiveScrollTimelineCtx,
  SetScrollTimelineCtx,
} from "@/providers/useContext/TimelineCtxProvider";
import {
  SetUserDocumentViewportCtx,
  SetCurrentVideoViewportCtx,
  UserDocumentViewportCtx,
  CurrentVideoViewportCtx,
} from "@/providers/useContext/ViewportCtxProvider";
import { AssetDataCtx } from "@/providers/useContext/AssetDataCtxProvider";
import {
  DispatchVideoCropAreaCtx,
  DispatchVideoPlayerStateCtx,
  VideoCropAreaCtx,
  VideoPlayerStateCtx,
} from "@/providers/useContext/VideoPlayerCtxProvider";
import { useContext } from "react";

/**
 * Video Player Ctx
 */

export const useVideoPlayerStateCtx = () => useContext(VideoPlayerStateCtx);

export const useDispatchVideoPlayerStateCtx = () =>
  useContext(DispatchVideoPlayerStateCtx);

export const useVideoCropAreaCtx = () => useContext(VideoCropAreaCtx);
export const useDispatchVideoCropAreaCtx = () =>
  useContext(DispatchVideoCropAreaCtx);

/**
 * Document Player Ctx
 */

export const useDocumentPlayerStateCtx = () =>
  useContext(DocumentPlayerStateCtx);
export const useDispatchDocumentPlayerStateCtx = () =>
  useContext(DispatchDocumentPlayerStateCtx);

export const useDocumentPlayerElementCtx = () =>
  useContext(DocumentPlayerElementCtx);

/**
 * User Viewport Ctx
 */

export const useCurrentVideoViewportCtx = () =>
  useContext(CurrentVideoViewportCtx);
export const useSetCurrentVideoViewportCtx = () =>
  useContext(SetCurrentVideoViewportCtx);

export const useUserDocumentViewportCtx = () =>
  useContext(UserDocumentViewportCtx);
export const useSetUserDocumentViewportCtx = () =>
  useContext(SetUserDocumentViewportCtx);

export const useSeekbarActiveTimesCtx = () => useContext(SeekbarActiveTimesCtx);
export const useSetSeekbarActiveTimesCtx = () =>
  useContext(SetSeekbarActiveTimesCtx);

export const useAssetDataCtx = () => useContext(AssetDataCtx);

/**
 * Pdf Renderer Ctx
 */

export const useDispatchPdfRenderStateCtx = () =>
  useContext(DispatchPdfRendererStateCtx);
export const usePdfRendererStateCtx = () => useContext(PdfRendererStateCtx);

export const useDispatchPdfPageStateCtx = () =>
  useContext(DispatchPdfPageStateCtx);
export const usePdfPageStateCtx = () => useContext(PdfPageStateCtx);

/**
 * Timeline Ctx
 */

export const useScrollTimelineCtx = () => useContext(ScrollTimelineCtx);
export const useSetScrollTimelineCtx = () => useContext(SetScrollTimelineCtx);
export const useActiveScrollTimelineCtx = () =>
  useContext(ActiveScrollTimelineCtx);
export const useSetActiveScrollTimelineCtx = () =>
  useContext(SetActiveScrollTimelineCtx);
