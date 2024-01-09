import React, { useCallback } from "react";
import {
  assetLoaderStateAtom,
  localFilePickerActiveAtom,
  pdfSrcAtom,
  videoSrcAtom,
} from "@/providers/jotai/swapVidPlayer";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { AppMenuModalTypeA } from "@/presentations/Modal";
import { useFileInput } from "@/hooks/useFileInput";

export const LocalFilePicker: React.FC<{ zIndex?: number }> = ({ zIndex }) => {
  const assetLoaderState = useAtomValue(assetLoaderStateAtom);
  const setVideoSrc = useSetAtom(videoSrcAtom);
  const setPdfSrc = useSetAtom(pdfSrcAtom);

  const [active, setActive] = useAtom(localFilePickerActiveAtom);

  const videoInput = useFileInput();
  const pdfInput = useFileInput();

  const handleSubmit = useCallback(() => {
    videoInput.file && setVideoSrc(URL.createObjectURL(videoInput.file));
    pdfInput.file && setPdfSrc(URL.createObjectURL(pdfInput.file));

    setActive(false);
  }, [setActive, videoInput.file, pdfInput.file]);

  return (
    <AppMenuModalTypeA title="Asset Picker" visibility={active} zIndex={zIndex}>
      <div className="grid justify-center gap-8 text-xl">
        <h2 className="text-center font-bold">Select the asset files below:</h2>

        {!assetLoaderState.video.presetsEnabled && (
          <div className="flex-xyc gap-8">
            <p>Video File</p>
            <input
              className="bg-slate-200 p-2 rounded-sm hover:bg-slate-300"
              type="file"
              accept="video/*"
              onChange={videoInput.handleOnInputChange}
              maxLength={1}
            />
          </div>
        )}

        {!assetLoaderState.pdf.presetsEnabled && (
          <div className="flex-xyc gap-8">
            <p>PDF File</p>
            <input
              className="bg-slate-200 p-2 rounded-sm hover:bg-slate-300"
              type="file"
              accept=".pdf"
              onChange={pdfInput.handleOnInputChange}
              maxLength={1}
            />
          </div>
        )}

        <button
          className="w-28 p-2 mx-auto bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-xl text-white font-bold rounded-full"
          disabled={!videoInput.file}
          onClick={handleSubmit}
        >
          OK
        </button>
      </div>
    </AppMenuModalTypeA>
  );
};
