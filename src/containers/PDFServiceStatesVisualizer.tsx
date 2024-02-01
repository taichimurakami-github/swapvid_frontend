import { AppProgressBar } from "@/presentations/BackendApi";
import { backendPdfAnalyzerApiStateAtom } from "@/providers/jotai/store";
import { useAtomValue } from "jotai/react";

export function PDFServiceStatesVisualizer() {
  const backendPdfAnalyzerApiState = useAtomValue(
    backendPdfAnalyzerApiStateAtom
  );

  if (!backendPdfAnalyzerApiState) {
    return <></>;
  }

  return (
    <div className="grid overflow-hidden">
      <p className="px-2 text-white">Generating document index ...</p>
      <AppProgressBar
        heightPx={8}
        progressPct={backendPdfAnalyzerApiState.progress}
      />
    </div>
  );
}
