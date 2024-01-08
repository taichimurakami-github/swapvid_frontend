import { batchStateUpdates } from "@/utils/reducerUtil";
import { TPdfPageState } from "../PdfRendererCtx";

export type PdfPageStateActions =
  | {
      type: "update";
      value: Partial<TPdfPageState>;
    }
  | {
      type: "update_base_width";
      value: number;
    }
  | {
      type: "update_render_scale";
      value: number;
    };

export const pdfPageStateReducer = (
  state: TPdfPageState,
  action: PdfPageStateActions
): TPdfPageState => {
  switch (action.type) {
    case "update":
      return batchStateUpdates<TPdfPageState>(state, {
        ...state,
        ...action.value,
      });

    case "update_base_width":
      return batchStateUpdates<TPdfPageState>(state, {
        ...state,
        baseWidth: action.value,
      });

    case "update_render_scale":
      return batchStateUpdates<TPdfPageState>(state, {
        ...state,
        renderScale: action.value,
      });

    default:
      console.log(action);
      throw new Error("Invalid action type");
  }
};
