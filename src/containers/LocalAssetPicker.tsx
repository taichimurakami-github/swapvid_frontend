import React, { useCallback, useState } from "react";
import {
  localFilePickerActiveAtom,
  pdfSrcAtom,
  preGeneratedScrollTimelineDataAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useAtom, useSetAtom } from "jotai/react";
import { AppModalTypeA, AppModalWrapper } from "@/presentations/Modal";
import { useMultipleFilesInput } from "@/hooks/useFileInput";

/**
 * Load large files
 */
export const LocalAssetPicker: React.FC<{ zIndex?: number }> = ({ zIndex }) => {
  // const { video: loaderStateVideo, pdf: loaderStatePdf } =
  //   useAtomValue(assetLoaderStateAtom);

  const setVideoSrc = useSetAtom(videoSrcAtom);
  const setPdfSrc = useSetAtom(pdfSrcAtom);
  const setPreGeneratedScrollTimelineData = useSetAtom(
    preGeneratedScrollTimelineDataAtom
  );

  const [active, setActive] = useAtom(localFilePickerActiveAtom);

  // const videoInput = useFileInput();
  // const pdfInput = useFileInput();
  // const scrollTimelineInput = useFileInput();

  const { files, handleOnInputChange } = useMultipleFilesInput();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(async () => {
    /** Validation */
    const validationResult = {
      mp4Included: false,
      pdfIncluded: false,
    };
    for (const f of files as FileList) {
      validationResult.mp4Included =
        validationResult.mp4Included || f.name.includes(".mp4");
      validationResult.pdfIncluded =
        validationResult.pdfIncluded || f.name.includes(".pdf");
    }

    if (Object.values(validationResult).filter((v) => !v).length > 0) {
      const message = [
        !validationResult.mp4Included && ".mp4 file",
        !validationResult.pdfIncluded && ".pdf file",
      ]
        .filter((v) => v)
        .join(" and ");

      return setErrorMessage(`Please include ${message}`);
    }

    /** Registration */
    for (const f of files as FileList) {
      const ext = f.name.split(".").pop();

      switch (ext) {
        case "mp4":
          setVideoSrc(URL.createObjectURL(f));
          break;
        case "pdf":
          setPdfSrc(URL.createObjectURL(f));
          break;
        case "json":
          f.name.includes(".scroll.json") &&
            setPreGeneratedScrollTimelineData(JSON.parse(await f.text()));
      }
    }

    setActive(false);
  }, [
    setActive,
    setVideoSrc,
    setPdfSrc,
    setPreGeneratedScrollTimelineData,
    files,
  ]);

  const EscapedAssetIdSymbol = (
    <span className="inline-block mx-2 text-teal-600">
      &#123; Asset Id &#125;
    </span>
  );

  return (
    <AppModalWrapper visibility={active} zIndex={zIndex}>
      <AppModalTypeA title="Please choose assets">
        <div className="grid justify-center gap-8 text-xl">
          <h2 className="text-center font-bold">Select the Asset Files</h2>

          <p className="flex gap-2">
            Requirements:
            <b>
              ①{EscapedAssetIdSymbol}.mp4, ②{EscapedAssetIdSymbol}
              .pdf
            </b>
          </p>
          <p>
            Optional: <b>{EscapedAssetIdSymbol}.scroll.json</b>
          </p>

          <input
            className="bg-slate-200 p-2 rounded-sm hover:bg-slate-300"
            type="file"
            accept="video/*,.pdf,.json"
            onChange={handleOnInputChange}
            maxLength={3}
            minLength={2}
            multiple
          />

          {errorMessage && (
            <p className="text-red-600 text-center font-bold">{errorMessage}</p>
          )}

          <button
            className="w-28 p-2 mx-auto bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-xl text-white font-bold rounded-full"
            // disabled={!videoInput.file}
            disabled={!files}
            onClick={handleSubmit}
          >
            OK
          </button>
        </div>
      </AppModalTypeA>
    </AppModalWrapper>
  );
};
