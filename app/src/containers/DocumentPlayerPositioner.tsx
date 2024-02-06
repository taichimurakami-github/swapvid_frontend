import {
  pdfSrcAtom,
  userCroppedAreaAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import { useAtomValue } from "jotai/react";
import { PropsWithChildren } from "react";

export const DocumentPlayerPositioner: React.FC<
  PropsWithChildren<{
    useCroppedAreaEnabled?: boolean;
    rawScaleEnabled?: boolean;
    zIndex?: number;
  }>
> = ({ useCroppedAreaEnabled, rawScaleEnabled, zIndex, children }) => {
  const userCroppedArea = useAtomValue(userCroppedAreaAtom);

  const videoSrc = useAtomValue(videoSrcAtom);
  const pdfSrc = useAtomValue(pdfSrcAtom);

  if (!useCroppedAreaEnabled) {
    return (
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          zIndex: zIndex ?? "auto",
          pointerEvents: videoSrc && pdfSrc ? "auto" : "none",
        }}
      >
        {children}
      </div>
    );
  }

  if (!userCroppedArea)
    return (
      <div className="absolute top-0 left-0 w-full h-full">{children}</div>
    );

  const scaleToRender = rawScaleEnabled
    ? userCroppedArea.raw
    : userCroppedArea.videoScale;

  const { width, height, top, left } = scaleToRender;

  return (
    <div
      className="absolute"
      style={{
        top: top,
        left: left,
        width: width,
        height: height,
        zIndex: zIndex ?? "auto",
      }}
    >
      {children}
    </div>
  );
};
