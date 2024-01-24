import { userCroppedAreaAtom } from "@/providers/jotai/store";
import { useAtomValue } from "jotai/react";
import { PropsWithChildren } from "react";

export const CroppedAreaPositioner: React.FC<
  PropsWithChildren<{
    rawScaleEnabled?: boolean;
  }>
> = ({ rawScaleEnabled, children }) => {
  const userCroppedArea = useAtomValue(userCroppedAreaAtom);

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
      }}
    >
      {children}
    </div>
  );
};
