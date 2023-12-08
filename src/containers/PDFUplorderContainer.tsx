import usePDFAnalyzer from "@/hooks/usePDFAnalyzer";
import usePDFReceiver from "@/hooks/usePDFReceiver";
import {
  faFileLines,
  faFilePdf,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useCallback, useRef, useState } from "react";

type UploaderProgress =
  | "INIT"
  | "FILE_SELECTED"
  | "UPLOADING"
  | "ANALYZING"
  | "DONE"
  | "ERROR";

export default function PDFUplorderContainer(
  props: PropsWithChildren<{
    active: boolean;
    handleComponentActive: (active?: boolean) => void;
  }>
) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<UploaderProgress>("INIT");
  const [analysisProgressPct, setAnalysisProgressPct] = useState<string>("0%"); // [TODO

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadPDF } = usePDFReceiver();
  const { runPDFContentAnalysis } = usePDFAnalyzer();

  const initializeUploader = useCallback(() => {
    if (fileInputRef.current) {
      setFile(null);
      setProgress("INIT");
      setAnalysisProgressPct("0%");
      fileInputRef.current.value = "";
    }
  }, [fileInputRef]);

  const closeUploader = useCallback(() => {
    initializeUploader();
    props.handleComponentActive(false);
  }, [initializeUploader, props]);

  const handleOnClickWrapper = useCallback<
    React.MouseEventHandler<HTMLDivElement>
  >((e) => {
    e.stopPropagation();
  }, []);

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
      return setAnalysisProgressPct(progress.split("=")[1]);
    },
    [setAnalysisProgressPct]
  );

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      try {
        if (file) {
          const assetId = file.name.split(".")[0];
          setProgress("UPLOADING");
          await uploadPDF(file, assetId);

          setProgress("ANALYZING");
          await runPDFContentAnalysis(
            assetId,
            () => {
              setProgress("DONE");
              setTimeout(() => {
                initializeUploader();
                closeUploader();
              }, 2000);
            },
            pdfAnalysisProgressParser
          );
        }
      } catch (e) {
        setProgress("ERROR");
      }
    },
    [
      file,
      setProgress,
      uploadPDF,
      initializeUploader,
      closeUploader,
      pdfAnalysisProgressParser,
      runPDFContentAnalysis,
    ]
  );

  if (!props.active) return <></>;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex-xyc flex-col gap-4 bg-[rgba(0,0,0,0.5)] text-white text-xl"
      onClick={handleOnClickWrapper}
    >
      <form
        className="relative bg-white rounded-lg p-10 grid place-items-center gap-8"
        onSubmit={handleSubmit}
      >
        {(progress === "INIT" || progress === "FILE_SELECTED") && (
          <button
            className="absolute right-4 top-4 p-2 font-bold bg-slate-600 hover:bg-slate-500 rounded-full"
            onClick={closeUploader}
          >
            <div className="relative h-full p-3">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block bg-white w-[1.5rem] h-[5px] rotate-45"></span>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block bg-white w-[1.5rem] h-[5px] -rotate-45"></span>
            </div>
          </button>
        )}

        {(progress === "INIT" || progress === "FILE_SELECTED") && (
          <>
            <div className="grid gap-2 place-items-center">
              <input
                className="p-2 text-black"
                type="file"
                accept="application/pdf"
                onChange={handleChangeFileInput}
                ref={fileInputRef}
              />

              {progress === "FILE_SELECTED" && (
                <button
                  className="p-2 text-black underline w-[300px]"
                  onClick={initializeUploader}
                >
                  選択ファイルを削除
                </button>
              )}
            </div>

            <button className="p-2 rounded-full bg-blue-600 hover:bg-slate-500 w-[300px] font-bold">
              <FontAwesomeIcon icon={faCloudArrowUp} className="mr-2" />
              アップロード開始
            </button>
          </>
        )}

        {progress === "UPLOADING" && (
          <p className="text-black">PDFファイルをアップロード中 ...</p>
        )}

        {progress === "ANALYZING" && (
          <>
            <p className="text-black">
              Document Indexの作成中. お待ちください ...
            </p>

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

            <div className="relative p-2 bg-gray-300 w-full h-[30px]">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500"
                style={{
                  width: analysisProgressPct,
                  transition: "all 0.5s ease-in-out",
                }}
              ></div>
            </div>
          </>
        )}

        {progress === "DONE" && (
          <p className="text-black">
            Document index file has been created successfully.
          </p>
        )}
        {progress === "ERROR" && (
          <p className="text-black">An Error has occured. Please retry.</p>
        )}
      </form>
    </div>
  );
}
