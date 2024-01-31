import {
  faCloudArrowUp,
  faFileLines,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const ProgressForm: React.FC<{ progressPct: number; text: string }> = ({
  progressPct,
  text,
}) => (
  <div className="grid gap-4">
    <p className="text-black">{text}</p>

    <div className="flex-xyc gap-8 w-full text-black">
      <FontAwesomeIcon icon={faFilePdf} size="3x" className="text-red-600" />
      <span className="text-4xl">&gt;&gt;</span>
      <FontAwesomeIcon icon={faFileLines} size="3x" className="text-blue-500" />
    </div>

    <div className="relative p-2 bg-gray-300 w-full h-[30px]">
      <div
        className="absolute top-0 left-0 h-full bg-blue-500"
        style={{
          width: progressPct + "%",
          transition: "all 0.5s ease-in-out",
        }}
      ></div>
    </div>
  </div>
);

export const FileUploaderForm: React.FC<{
  handleChangeFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteSelectedFile?: () => void;
  fileReady?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  enableFileDeletionButton?: boolean;
}> = ({
  handleChangeFileInput,
  inputRef,
  enableFileDeletionButton,
  fileReady,
  handleDeleteSelectedFile,
}) => (
  <div className="grid gap-8 place-items-center">
    <input
      className="p-2 text-black"
      type="file"
      accept="application/pdf"
      onChange={handleChangeFileInput}
      ref={inputRef}
    />

    {enableFileDeletionButton && (
      <button
        className="p-2 text-black underline w-[300px]"
        onClick={handleDeleteSelectedFile}
      >
        選択ファイルを削除
      </button>
    )}

    <button
      className="p-2 rounded-full bg-teal-600 hover:bg-teal-700 w-[300px] font-bold disabled:opacity-40"
      disabled={!fileReady}
    >
      <FontAwesomeIcon icon={faCloudArrowUp} className="mr-2" />
      アップロード開始
    </button>
  </div>
);
