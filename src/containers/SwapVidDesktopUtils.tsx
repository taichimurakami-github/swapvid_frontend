import React, { PropsWithChildren } from "react";
import {
  pdfUploaderActiveAtom,
  videoCropperActiveAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useSetAtom } from "jotai";
import { useAtomValue } from "jotai/react";

export const SwapVidDesktopUtils: React.FC<{ zIndex?: number }> = ({
  zIndex,
}) => {
  return (
    <div style={{ zIndex: zIndex ?? "auto" }}>
      <SwapVidDesktopMenu />
    </div>
  );
};

export const SwapVidDesktopMenu: React.FC<{ zIndex?: number }> = ({
  zIndex,
}) => {
  const setVideoCropperActive = useSetAtom(videoCropperActiveAtom);
  const setPdfUploaderActive = useSetAtom(pdfUploaderActiveAtom);

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
        <button
          className="p-3 bg-teal-600 hover:bg-teal-700 rounded-full"
          onClick={() => setVideoCropperActive(true)}
        >
          Crop Video Area
        </button>

        <button
          className="p-3 bg-teal-600 hover:bg-teal-700 rounded-full"
          onClick={() => setPdfUploaderActive(true)}
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
