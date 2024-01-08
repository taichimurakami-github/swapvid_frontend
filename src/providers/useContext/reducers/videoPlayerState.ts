import { TVideoPlayerState } from "@/providers/useContext/VideoPlayerCtxProvider";
import { batchStateUpdates } from "@/utils/reducerUtil";

export type TVideoPlayerStateReducerActions =
  | { type: "update"; value: Partial<TVideoPlayerState> }
  | {
      type: "update_paused";
      value: boolean;
    }
  | {
      type: "update_loaded";
      value: boolean;
    }
  | {
      type: "update_loading";
      value: boolean;
    }
  | {
      type: "update_muted";
      value: boolean;
    }
  | {
      type: "update_subtitles_active";
      value: boolean;
    };

export const videoPlayerStateReducer = (
  state: TVideoPlayerState,
  action: TVideoPlayerStateReducerActions
): TVideoPlayerState => {
  switch (action.type) {
    case "update":
      return batchStateUpdates<TVideoPlayerState>(state, {
        ...state,
        ...action.value,
      });

    case "update_paused":
      return batchStateUpdates<TVideoPlayerState>(state, {
        ...state,
        paused: action.value,
      });

    case "update_loaded":
      return batchStateUpdates<TVideoPlayerState>(state, {
        ...state,
        loaded: action.value,
        loading: !action.value,
      });

    case "update_loading":
      return batchStateUpdates<TVideoPlayerState>(state, {
        ...state,
        loading: action.value,
        loaded: !action.value,
      });

    case "update_muted":
      return batchStateUpdates<TVideoPlayerState>(state, {
        ...state,
        muted: action.value,
      });

    case "update_subtitles_active":
      return batchStateUpdates<TVideoPlayerState>(state, {
        ...state,
        subtitlesActive: action.value,
      });

    default:
      console.log(action);
      throw new Error("Invalid action type");
  }
};
