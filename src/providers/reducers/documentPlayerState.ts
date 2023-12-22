import { TDocumentPlayerState } from "@/providers/DocumentPlayerCtxProvider";

export type documentPlayerStateReducerActions =
  | {
      type: "update";
      value: Partial<TDocumentPlayerState>;
    }
  | { type: "update_active"; value: boolean }
  | { type: "update_loaded"; value: boolean }
  | { type: "update_document_available"; value: boolean }
  | { type: "update_standby"; value: boolean };

export const documentPlayerStateReducer = (
  state: TDocumentPlayerState,
  action: documentPlayerStateReducerActions
): TDocumentPlayerState => {
  switch (action.type) {
    case "update":
      return JSON.stringify({ ...state, ...action.value }) ===
        JSON.stringify(state)
        ? state
        : { ...state, ...action.value };

    case "update_active":
      return state.active === action.value
        ? state
        : { ...state, active: action.value };

    case "update_loaded":
      return state.loaded === action.value
        ? state
        : { ...state, loaded: action.value };

    case "update_document_available":
      return state.documentAvailable === action.value
        ? state
        : { ...state, documentAvailable: action.value };

    case "update_standby":
      return state.standby === action.value
        ? state
        : { ...state, standby: action.value };

    default:
      console.log(action);
      throw new Error(`Invalid action type`);
  }
};
