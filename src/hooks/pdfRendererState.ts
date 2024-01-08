import { TPdfRendererState } from "@/providers/useContext/PdfRendererCtx";
import { batchStateUpdates } from "@/utils/reducerUtil";

export type TPdfRendererStateReducerActions = {
  type: "update";
  value: Partial<TPdfRendererState>;
};

export const pdfRendererStateReducer = (
  state: TPdfRendererState,
  action: TPdfRendererStateReducerActions
): TPdfRendererState => {
  switch (action.type) {
    case "update":
      return batchStateUpdates<TPdfRendererState>(state, {
        ...state,
        ...action.value,
      });

    default:
      console.log(action);
      throw new Error("Invalid action type");
  }
};
