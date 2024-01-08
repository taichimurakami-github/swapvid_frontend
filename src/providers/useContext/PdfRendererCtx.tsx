import React, { PropsWithChildren, createContext, useReducer } from "react";
import {
  PdfPageStateActions,
  pdfPageStateReducer,
} from "./reducers/renderedPdfPage";
import {
  TPdfRendererStateReducerActions,
  pdfRendererStateReducer,
} from "@/hooks/pdfRendererState";

export type TPdfPageState = {
  baseWidth: number;
  renderScale: number;
};
export type TPdfPageStateCtx = TPdfPageState | null;
export const PdfPageStateCtx = createContext<TPdfPageStateCtx>(null);

export type TDispatchPdfPageStateCtx =
  React.Dispatch<PdfPageStateActions> | null;
export const DispatchPdfPageStateCtx =
  createContext<TDispatchPdfPageStateCtx>(null);

export type TPdfRendererState = {
  pdfSrc: string;
  pdfLoaded: boolean;
  pdfPageLength: number;
};
export type TPdfRendererStateCtx = TPdfRendererState | null;
export const PdfRendererStateCtx = createContext<TPdfRendererStateCtx>(null);
export type TDispatchPdfRendererStateCtx =
  React.Dispatch<TPdfRendererStateReducerActions> | null;
export const DispatchPdfRendererStateCtx =
  createContext<TDispatchPdfRendererStateCtx>(null);

export default function PdfRendererCtxProvider(props: PropsWithChildren) {
  const [PdfRendererState, dispatchPdfRendererState] = useReducer(
    pdfRendererStateReducer,
    {
      pdfSrc: "",
      pdfLoaded: false,
      pdfPageLength: 0,
    }
  );

  const [pdfPageState, dispatchPdfPageState] = useReducer(pdfPageStateReducer, {
    baseWidth: 0,
    renderScale: 0,
  });

  return (
    <DispatchPdfRendererStateCtx.Provider value={dispatchPdfRendererState}>
      <PdfRendererStateCtx.Provider value={PdfRendererState}>
        <DispatchPdfPageStateCtx.Provider value={dispatchPdfPageState}>
          <PdfPageStateCtx.Provider value={pdfPageState}>
            {props.children}
          </PdfPageStateCtx.Provider>
        </DispatchPdfPageStateCtx.Provider>
      </PdfRendererStateCtx.Provider>
    </DispatchPdfRendererStateCtx.Provider>
  );
}
