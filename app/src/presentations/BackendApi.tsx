import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const AppProgressBar: React.FC<{
  progressPct: number;
  heightPx?: number;
}> = ({ progressPct, heightPx }) => (
  <div className="flex justify-start p-[2px] w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-teal-500 rounded-full"
      style={{
        width: progressPct + "%",
        height: heightPx ?? "15px",
        transition: "all 0.5s ease-in-out",
      }}
    ></div>
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
