import React, { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai/react";
import {
  PlayerCombinedView,
  PlayerParallelView,
} from "@/presentations/SwapVidPlayerView";
import {
  appModalElementAtom,
  assetIdAtom,
  assetLoaderStateAtom,
  backendPdfAnalyzerApiStateAtom,
  backendServiceHostAtom,
  localFilePickerActiveAtom,
  pdfSrcAtom,
  sequenceAnalyzerEnabledAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useBackendFileExplorerApi } from "@/hooks/useBackendFileExplorerApi";
import usePDFAnalyzer from "@/hooks/usePDFAnalyzer";
import usePDFReceiver from "@/hooks/usePDFReceiver";
import { LocalAssetRegistrationForm } from "./LocalAssetPicker";
// import { TAssetId } from "@/types/swapvid";

export const SwapVidPlayerRoot: React.FC<{
  mediaSourceType?: "streaming" | "local" | "presets";
  zIndex?: number;
  swapvidDesktopEnabled?: boolean;
}> = ({ zIndex }) => {
  const assetId = useAtomValue(assetIdAtom);
  const interfaceType = useAtomValue(swapvidInterfaceTypeAtom);
  const swapvidDesktopEnabled = useAtomValue(swapvidDesktopEnabledAtom);
  const assetLoaderState = useAtomValue(assetLoaderStateAtom);
  const videoSrc = useAtomValue(videoSrcAtom);
  const pdfSrc = useAtomValue(pdfSrcAtom);
  const backendServiceHost = useAtomValue(backendServiceHostAtom);
  const sequenceAnalyzerEnabled = useAtomValue(sequenceAnalyzerEnabledAtom);

  const setLocalFilePickerActive = useSetAtom(localFilePickerActiveAtom);
  const setBackendPdfAnalyzerApiState = useSetAtom(
    backendPdfAnalyzerApiStateAtom
  );

  useEffect(() => {
    const localSourceRegistered = !!(videoSrc && pdfSrc);

    if (!localSourceRegistered) {
      setLocalFilePickerActive(true);
    }
  }, [
    assetId,
    assetLoaderState,
    swapvidDesktopEnabled,
    setLocalFilePickerActive,
    videoSrc,
    pdfSrc,
  ]);

  const { fetchBackendAssetFiles } =
    useBackendFileExplorerApi(backendServiceHost);
  const { runPDFContentAnalysis } = usePDFAnalyzer(backendServiceHost);
  const { uploadPDF } = usePDFReceiver(backendServiceHost);

  const dispatchAppModalElement = useSetAtom(appModalElementAtom);

  useEffect(() => {
    if (!pdfSrc || !videoSrc) {
      return dispatchAppModalElement({
        type: "open",
        payload: (
          <LocalAssetRegistrationForm
            handleClose={() => dispatchAppModalElement({ type: "close" })}
          />
        ),
      });
    }

    const assetId = pdfSrc.name.split(".")[0];

    (async () => {
      const currentBackendFiles = await fetchBackendAssetFiles();
      console.log("current available files:", currentBackendFiles);

      if (!currentBackendFiles) {
        console.log(
          "ERROR: Backend server does not responded. Please chech if the contaienr is running."
        );
        return;
      }

      if (!currentBackendFiles.pdf_files.includes(pdfSrc.name)) {
        /**
         * If the pdf file does not exist in Backend directory,
         * Upload current file first.
         */

        await uploadPDF(pdfSrc, assetId);
      } else {
        console.log("The current PDF file already exists.");
      }

      /**
       * The index-data generation will be skipped
       * if there the index file already exists.
       */
      runPDFContentAnalysis(
        assetId,
        () => setBackendPdfAnalyzerApiState(null),
        (msg: string) => {
          setBackendPdfAnalyzerApiState({ progress: Number(msg) });
        }
      );

      // if(!backendFiles)
    })();
  }, [
    pdfSrc,
    sequenceAnalyzerEnabled,
    fetchBackendAssetFiles,
    uploadPDF,
    runPDFContentAnalysis,
    setBackendPdfAnalyzerApiState,
    videoSrc,
    dispatchAppModalElement,
  ]);

  switch (interfaceType) {
    case "combined":
      return (
        <PlayerCombinedView
          zIndex={zIndex}
          swapvidDesktopEnabled={swapvidDesktopEnabled}
        />
      );

    case "parallel":
      return <PlayerParallelView zIndex={zIndex} />;
  }
};
