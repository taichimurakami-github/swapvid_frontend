import React, { useCallback, useReducer } from "react";
import {
  localFilePickerActiveAtom,
  pdfSrcAtom,
  preGeneratedScrollTimelineDataAtom,
  swapvidDesktopEnabledAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { useMultipleFilesInput } from "@/hooks/useFileInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ScreenCaptureAuthorizationButton } from "@containers/SwapVidDesktopUtils";
import { AppModalWrapper } from "@/presentations/Modal";

const CheckMark: React.FC<{ active: boolean }> = ({ active }) => (
  <div
    className="bg-teal-600 text-white rounded-full w-8 h-8 flex-xyc font-bold"
    style={{
      opacity: active ? 1 : 0.3,
    }}
  >
    <FontAwesomeIcon icon={faCheck} />
  </div>
);

const Item: React.FC<{
  title: string;
  errorMessage?: string;
  value: boolean;
}> = ({ title, errorMessage, value }) => (
  <div className="flex-xyc gap-2">
    <CheckMark active={value} />
    <p className="grid">
      <span className="text-lg">{title}</span>
      <b className="text-red-600 text-md">{errorMessage ?? ""}</b>
    </p>
  </div>
);

type PickedAssetState<T> = {
  video: T;
  document: T;
  scrollTimeline: T;
};

type SelectedAssetState = PickedAssetState<boolean>;
type ErrorMessageState = PickedAssetState<string>;

/**
 * Load large files
 */
export const LocalAssetRegistrationForm: React.FC<{
  handleClose: () => void;
}> = ({ handleClose }) => {
  const [selectedAsset, dispatchSelectedAsset] = useReducer(
    (b: SelectedAssetState, payload: Partial<SelectedAssetState>) => ({
      ...b,
      ...payload,
    }),
    {
      video: false,
      document: false,
      scrollTimeline: false,
    }
  );

  const [errorMessage, dispatchErrorMessage] = useReducer(
    (b: ErrorMessageState, payload: Partial<ErrorMessageState>) => ({
      ...b,
      ...payload,
    }),
    {
      video: "",
      document: "",
      scrollTimeline: "",
    }
  );

  const swapVidDesktopEnabled = useAtomValue(swapvidDesktopEnabledAtom);

  const setVideoSrc = useSetAtom(videoSrcAtom);
  const setPdfSrc = useSetAtom(pdfSrcAtom);
  const setPreGeneratedScrollTimelineData = useSetAtom(
    preGeneratedScrollTimelineDataAtom
  );

  const { files, handleOnInputChange } = useMultipleFilesInput();
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleOnInputChange(e);

      if (!e.target.files) {
        return;
      }

      /** Requirements validation */
      const validationResult: SelectedAssetState = {
        ...selectedAsset,
        scrollTimeline: true,
      };

      for (const f of e.target.files as FileList) {
        validationResult.video =
          validationResult.video ||
          f.name.includes(".mp4") ||
          f.name.includes(".mov");

        validationResult.document =
          validationResult.document || f.name.includes(".pdf");
      }

      Object.keys(errorMessage).map((key) =>
        dispatchErrorMessage({
          [key]: validationResult[key as keyof SelectedAssetState]
            ? ""
            : `${key} file is required.`,
        })
      );

      /** Update selectedAssetState */
      for (const f of e.currentTarget.files as FileList) {
        const ext = f.name.split(".").pop();
        switch (ext) {
          case "mp4":
          case "mov":
            dispatchSelectedAsset({ video: true });
            break;

          case "pdf":
            dispatchSelectedAsset({ document: true });
            break;

          case "json":
            dispatchSelectedAsset({ scrollTimeline: true });
            break;
        }
      }
    },
    [errorMessage, handleOnInputChange, selectedAsset]
  );

  const handleSubmit = useCallback(async () => {
    /** Registration */
    for (const f of files as FileList) {
      const ext = f.name.split(".").pop();
      switch (ext) {
        case "mp4":
        case "mov":
          setVideoSrc(URL.createObjectURL(f));
          break;

        case "pdf":
          // setPdfSrc(URL.createObjectURL(f));
          setPdfSrc(f);
          break;

        case "json":
          f.name.includes(".scroll.json") &&
            setPreGeneratedScrollTimelineData(JSON.parse(await f.text()));
          break;
      }
    }

    handleClose();
  }, [
    files,
    handleClose,
    setVideoSrc,
    setPdfSrc,
    setPreGeneratedScrollTimelineData,
  ]);

  const submissionReady = selectedAsset.video && selectedAsset.document;
  // && selectedAsset.overviewImage;

  return (
    <AppModalWrapper title="Asset Picker" handleClose={handleClose}>
      <div className="grid justify-center gap-8 text-xl max-w-[750px]">
        <h2 className="text-center font-bold">
          Pleaase select required asset files.
        </h2>

        <div className="flex flex-col gap-6 items-start">
          {swapVidDesktopEnabled ? (
            <div className="flex justify-between items-center w-full">
              <Item
                title="Video Streaming"
                errorMessage={errorMessage.video}
                value={selectedAsset.video}
              />
              <ScreenCaptureAuthorizationButton
                onSetCaptureStream={() => {
                  dispatchSelectedAsset({ video: true });
                }}
              />
            </div>
          ) : (
            <Item
              title="【REQUIRED】 Video File (.mp4)"
              errorMessage={errorMessage.video}
              value={selectedAsset.video}
            />
          )}

          <Item
            title="【REQUIRED】 Document File (.pdf)"
            errorMessage={errorMessage.document}
            value={selectedAsset.document}
          />

          {!swapVidDesktopEnabled && (
            <Item
              title="【OPTIONAL】 Scroll Timeline (.json)"
              errorMessage={errorMessage.scrollTimeline}
              value={selectedAsset.scrollTimeline}
            />
          )}
        </div>

        <input
          className="bg-slate-200 p-2 rounded-sm hover:bg-slate-300"
          type="file"
          accept={`${swapVidDesktopEnabled ? "" : "video/*"},.pdf,.json`}
          onChange={handleChange}
          maxLength={3}
          minLength={2}
          multiple
        />

        <button
          className="w-28 p-2 mx-auto bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-xl text-white font-bold rounded-full"
          // disabled={!videoInput.file}
          disabled={!submissionReady}
          onClick={handleSubmit}
        >
          OK
        </button>
      </div>
    </AppModalWrapper>
  );
};
