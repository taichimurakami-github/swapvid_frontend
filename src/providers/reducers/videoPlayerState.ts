import { TVideoPlayerState } from "@/providers/VideoPlayerCtxProvider";

export type videoPlayerStateReducerActions =
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
  action: videoPlayerStateReducerActions
): TVideoPlayerState => {
  switch (action.type) {
    case "update":
      return { ...state, ...action.value };

    case "update_paused":
      return { ...state, paused: action.value };

    case "update_loaded":
      return { ...state, loaded: action.value, loading: !action.value };

    case "update_loading":
      return { ...state, loading: action.value, loaded: !action.value };

    case "update_muted":
      return { ...state, muted: action.value };

    case "update_subtitles_active":
      return { ...state, subtitlesActive: action.value };

    default:
      console.log(action);
      throw new Error("Invalid action type");
  }
};
