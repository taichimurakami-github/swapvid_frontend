import usePDFAnalyzer from "@hooks/usePDFAnalyzer";
import usePDFReceiver from "@hooks/usePDFReceiver";
import { faFileLines, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useRef, useState } from "react";
import { useAtomValue } from "jotai/react";
import {
  backendPdfAnalyzerApiStateAtom,
  backendServiceHostAtom,
} from "@/providers/jotai/store";
import { FileUploaderForm, AppProgressBar } from "@/presentations/BackendApi";
import { useFileInput } from "@/hooks/useFileInput";

export const PdfUplorder: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<React.ReactElement[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const backendApiHost = useAtomValue(backendServiceHostAtom);
  const backendPdfAnalyzerApiState = useAtomValue(
    backendPdfAnalyzerApiStateAtom
  );

  const { uploadPDF } = usePDFReceiver(backendApiHost);
  const { runPDFContentAnalysis } = usePDFAnalyzer(backendApiHost);

  const { file, setFile, handleOnInputChange } = useFileInput();

  const handleDeleteSelectedFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setFile, fileInputRef]);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      if (!file) return;

      let isErrorOccurred = false;
      const assetId = file.name.split(".")[0];

      await uploadPDF(file, assetId).catch((e) => {
        console.log(e);
        isErrorOccurred = true;
        setErrorMessage([
          <span className="font-bold">Failed to upload PDF file.</span>,
          <span className="text-red-600">Reason: ${e.message}</span>,
        ]);
      });

      if (!isErrorOccurred) {
        await runPDFContentAnalysis(assetId).catch((e) => {
          console.log(e);
          isErrorOccurred = true;
          setErrorMessage([
            <span className="font-bold">Failed to generate index data.</span>,
            <span className="text-red-600">Reason: ${e.message}</span>,
          ]);
        });
      }
    },
    [file, uploadPDF, runPDFContentAnalysis]
  );

  return (
    <div
      className="relative bg-white rounded-lg p-10 flex-xyc flex-col gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      <FileUploaderForm
        handleSubmit={handleSubmit}
        handleChangeFileInput={handleOnInputChange}
        handleDeleteSelectedFile={handleDeleteSelectedFile}
        fileReady={!!file}
        inputRef={fileInputRef}
        enableFileDeletionButton={!!backendPdfAnalyzerApiState}
      />

      {errorMessage.length > 0 && (
        <div className="p-4 bg-red-100 rounded-md text-center font-bold">
          <p className="text-red-600">【Error】</p>
          {errorMessage.map((txt) => (
            <p>{txt}</p>
          ))}
        </div>
      )}

      {backendPdfAnalyzerApiState && (
        <div className="grid gap-4">
          <div className="flex-xyc gap-8 w-full text-black">
            <FontAwesomeIcon
              icon={faFilePdf}
              size="3x"
              className="text-red-600"
            />
            <span className="text-4xl">&gt;&gt;</span>
            <FontAwesomeIcon
              icon={faFileLines}
              size="3x"
              className="text-blue-500"
            />
          </div>
          <p className="text-black">
            Generating index data from the uploaded PDF file...
          </p>
          <AppProgressBar progressPct={backendPdfAnalyzerApiState.progress} />
        </div>
      )}
    </div>
  );
};
