import { TVideoCropArea } from "@/providers/useContext/VideoPlayerCtxProvider";
import { DOMRectLike } from "@/types/swapvid";
import { batchStateUpdates } from "@/utils/reducerUtil";

export type TVideoCropAreaReducerActions = {
  type: "update";
  rawValue: DOMRectLike;
  videoScaleValue: DOMRectLike;
};

export const videoCropAreaReducer = (
  state: TVideoCropArea,
  action: TVideoCropAreaReducerActions
): TVideoCropArea => {
  switch (action.type) {
    case "update":
      return batchStateUpdates<TVideoCropArea>(state, {
        raw: action.rawValue,
        videoScale: action.videoScaleValue,
      });

    default:
      console.log(action);
      throw new Error("Invalid action type");
  }
};
