import { TVideoCropArea } from "@/providers/VideoPlayerCtxProvider";
import { DOMRectLike } from "@/types/swapvid";

export type videoCropAreaReducerActions = {
  type: "update";
  rawValue: DOMRectLike;
  videoScaleValue: DOMRectLike;
};

export const videoCropAreaReducer = (
  state: TVideoCropArea,
  action: videoCropAreaReducerActions
): TVideoCropArea => {
  switch (action.type) {
    case "update":
      return { raw: action.rawValue, videoScale: action.videoScaleValue };

    default:
      console.log(action);
      throw new Error("Invalid action type");
  }
};
