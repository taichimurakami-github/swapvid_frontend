import usePDFAnalyzer from "@hooks/usePDFAnalyzer";
import usePDFReceiver from "@hooks/usePDFReceiver";
import {
  faFileLines,
  faFilePdf,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useRef, useState } from "react";
import { useAtom } from "jotai/react";
import { pdfUploaderActiveAtom } from "@/providers/jotai/store";
import { FileUploaderForm, AppProgressBar } from "@/presentations/BackendApi";

type UploaderProgress =
  | "INIT"
  | "FILE_SELECTED"
  | "UPLOADING"
  | "ANALYZING"
  | "DONE"
  | "ERROR";

export const PdfUplorder: React.FC<{ zIndex?: number }> = ({ zIndex }) => {
  const [pdfUploaderActive, setPdfUploaderActive] = useAtom(
    pdfUploaderActiveAtom
  );
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState<UploaderProgress>("INIT");
  const [analysisProgressPct, setAnalysisProgressPct] = useState<number>(0); // [TODO

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadPDF } = usePDFReceiver();
  const { runPDFContentAnalysis } = usePDFAnalyzer();

  const handleDeleteSelectedFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setFile, fileInputRef]);

  const closeUploader = useCallback(() => {
    setPdfUploaderActive(false);
  }, [setPdfUploaderActive]);

  const handleOnClickWrapper = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (progress === "UPLOADING" || progress === "ANALYZING") return;

      handleDeleteSelectedFile();
      setProgress("INIT");
      setAnalysisProgressPct(0);

      closeUploader();
    },
    [closeUploader, handleDeleteSelectedFile, progress]
  );

  const handleChangeFileInput = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      const files = e.currentTarget.files;
      if (!files || files.length === 0) {
        return setProgress("INIT");
      }

      setFile(files[0]);
      setProgress("FILE_SELECTED");
    },
    [setFile, setProgress]
  );

  const pdfAnalysisProgressParser = useCallback(
    (progress: string /** progress=0-100% */) => {
      return setAnalysisProgressPct(Number(progress));
    },
    [setAnalysisProgressPct]
  );

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      if (!file) return;

      let isErrorOccurred = false;
      const assetId = file.name.split(".")[0];
      setProgress("UPLOADING");
      await uploadPDF(file, assetId).catch((e) => {
        console.log(e);
        isErrorOccurred = true;
        setProgress("ERROR");
        setErrorMessage("Failed to upload PDF file.");
      });

      if (!isErrorOccurred) {
        setProgress("ANALYZING");
        await runPDFContentAnalysis(
          assetId,
          () => {
            setProgress("DONE");

            setTimeout(() => {
              handleOnClickWrapper();
            }, 2000);
          },
          pdfAnalysisProgressParser
        ).catch((e) => {
          console.log(e);
          isErrorOccurred = true;
          setProgress("ERROR");
          setErrorMessage("Failed to complete index-data generation.");
        });
      }
    },
    [
      file,
      uploadPDF,
      runPDFContentAnalysis,
      pdfAnalysisProgressParser,
      handleOnClickWrapper,
    ]
  );

  return (
    <div
      id="swapvid_desktop_pdf_uploader"
      className="fixed top-0 left-0 w-screen h-screen flex-xyc flex-col gap-4 bg-black-transparent-01 text-white text-xl"
      onClick={handleOnClickWrapper}
      style={{
        visibility: pdfUploaderActive ? "visible" : "hidden",
        zIndex: zIndex ?? "auto",
      }}
    >
      <form
        className="relative bg-white rounded-lg p-10 grid place-items-center gap-8"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        {(progress === "INIT" ||
          progress === "FILE_SELECTED" ||
          progress === "ERROR") && (
          <button
            className="absolute right-4 top-4 w-10 h-10 font-bold text-3xl bg-teal-600 hover:bg-teal-700 rounded-full"
            onClick={handleOnClickWrapper}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        )}

        {progress === "ERROR" && (
          <p className="text-red-600 font-bold">{errorMessage}</p>
        )}

        {(progress === "INIT" ||
          progress === "FILE_SELECTED" ||
          progress === "ERROR") && (
          <FileUploaderForm
            handleChangeFileInput={handleChangeFileInput}
            handleDeleteSelectedFile={handleDeleteSelectedFile}
            fileReady={!!file}
            inputRef={fileInputRef}
            enableFileDeletionButton={progress === "FILE_SELECTED"}
          />
        )}

        {progress === "UPLOADING" && (
          <p className="text-black">PDFファイルをアップロード中 ...</p>
        )}

        {progress === "ANALYZING" && (
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
              PDFを解析してIndexデータを作成しています...
            </p>
            <AppProgressBar progressPct={analysisProgressPct} />
          </div>
        )}

        {progress === "DONE" && (
          <p className="text-black">
            Document index file has been created successfully.
          </p>
        )}
      </form>
    </div>
  );
};
