import React from "react";
import { useAtomValue } from "jotai/react";
import { useVideoCurrenttime } from "@hooks/useVideoCurrenttime";
import { formatCurrentTimeIntoHMSString } from "@utils/formatCurrentTime";
import { videoElementRefAtom } from "@/providers/jotai/swapVidPlayer";

/**
 * Use standalone container for video toolbar current time container
 */
export const VideoToolbarCurrentTimeDisplay: React.FC<{
  liveModeEnabled?: boolean;
}> = ({ liveModeEnabled }) => {
  const videoElementRef = useAtomValue(videoElementRefAtom);
  const currentTime = useVideoCurrenttime(videoElementRef);
  const videoElement = videoElementRef?.current;

  if (liveModeEnabled) {
    return (
      <span className="flex-xyc gap-2 ">
        <span className="rounded-full h-[12px] w-[12px] bg-red-600 block"></span>
        LIVE
      </span>
    );
  }

  return (
    <span className="flex-xyc gap-2">
      <span className="font-bold text-xl">
        {formatCurrentTimeIntoHMSString(currentTime)}
      </span>
      <span>/</span>
      <span>
        {videoElement
          ? formatCurrentTimeIntoHMSString(videoElement.duration)
          : "--:--"}
      </span>
    </span>
  );
};
