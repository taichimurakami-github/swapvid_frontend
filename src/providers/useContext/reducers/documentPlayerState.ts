import { TDocumentPlayerState } from "@/providers/useContext/DocumentPlayerCtxProvider";
import { batchStateUpdates } from "@/utils/reducerUtil";

export type TDocumentPlayerStateReducerActions =
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
  action: TDocumentPlayerStateReducerActions
): TDocumentPlayerState => {
  switch (action.type) {
    case "update":
      return batchStateUpdates<TDocumentPlayerState>(state, {
        ...state,
        ...action.value,
      });

    case "update_active":
      return batchStateUpdates<TDocumentPlayerState>(state, {
        ...state,
        active: action.value,
      });

    case "update_loaded":
      return batchStateUpdates<TDocumentPlayerState>(state, {
        ...state,
        loaded: action.value,
      });

    case "update_document_available":
      return batchStateUpdates<TDocumentPlayerState>(state, {
        ...state,
        documentAvailable: action.value,
      });

    case "update_standby":
      return batchStateUpdates<TDocumentPlayerState>(state, {
        ...state,
        standby: action.value,
      });

    default:
      console.log(action);
      throw new Error(`Invalid action type`);
  }
};
