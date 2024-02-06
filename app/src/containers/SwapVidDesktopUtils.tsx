import React, { PropsWithChildren } from "react";
import {
  appModalElementAtom,
  assetLoaderStateAtom,
  sequenceAnalyzerEnabledAtom,
  videoCropperActiveAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useAtomValue, useSetAtom } from "jotai/react";

import { useDesktopCapture } from "@/hooks/useDesktopCapture";
import { PdfUplorder } from "./PDFUplorder";

export const SwapVidDesktopUtils: React.FC<{ zIndex?: number }> = ({
  zIndex,
}) => {
  return (
    <div style={{ zIndex: zIndex ?? "auto" }}>
      <SwapVidDesktopMenu />
    </div>
  );
};

export const ScreenCaptureAuthorizationButton: React.FC<{
  onSetCaptureStream?: (v: MediaStream) => void;
}> = ({ onSetCaptureStream }) => {
  const setVideoSrc = useSetAtom(videoSrcAtom);
  const setAssetLoaderState = useSetAtom(assetLoaderStateAtom);
  const setSequenceAnalyzerEnabled = useSetAtom(sequenceAnalyzerEnabledAtom);
  const captureDesktop = useDesktopCapture();
  const handleCaptureDesktop = async () => {
    const result = await captureDesktop();

    if (result) {
      setVideoSrc(result.captureStream);
      setAssetLoaderState((b) => ({
        ...b,
        video: { presetsEnabled: false, sourceType: "streaming" },
      }));
      setSequenceAnalyzerEnabled(true);

      onSetCaptureStream && onSetCaptureStream(result.captureStream);
    }
  };

  return (
    <button
      className="p-3 bg-teal-600 hover:bg-teal-700 rounded-full text-white font-bold"
      onClick={handleCaptureDesktop}
    >
      Capture Desktop
    </button>
  );
};

export const SwapVidDesktopMenu: React.FC<{ zIndex?: number }> = ({
  zIndex,
}) => {
  const setVideoCropperActive = useSetAtom(videoCropperActiveAtom);
  const dispatchAppModalElement = useSetAtom(appModalElementAtom);

  return (
    <div
      className="flex-xyc gap-16 p-2 bg-slate-600 text-white font-bold opacity-40 rounded-md hover:opacity-100"
      style={{
        zIndex: zIndex ?? "auto",
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <h3 className="select-none">SwapVid Desktop</h3>
      <div className="flex-xyc gap-4">
        <ScreenCaptureAuthorizationButton />

        <button
          className="p-3 bg-teal-600 hover:bg-teal-700 rounded-full"
          onClick={() => setVideoCropperActive(true)}
        >
          Crop Video Area
        </button>

        <button
          className="p-3 bg-teal-600 hover:bg-teal-700 rounded-full"
          onClick={() =>
            dispatchAppModalElement({
              type: "open",
              payload: <PdfUplorder />,
            })
          }
        >
          Upload PDF File
        </button>
      </div>
    </div>
  );
};

export const ShowDocumentPlayerOnDesktopCaptured: React.FC<
  PropsWithChildren
> = ({ children }) => {
  const videoSrc = useAtomValue(videoSrcAtom);

  if (!videoSrc || typeof videoSrc === "string") return null;

  return <>{children}</>;
};
