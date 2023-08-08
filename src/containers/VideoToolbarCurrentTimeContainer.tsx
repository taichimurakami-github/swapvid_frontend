import React from "react";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import { getHMFormatCurrentTime } from "@/utils/getHMFormatCurrentTime";

/**
 * Use standalone container for video toolbar current time container
 */
export default function VideoToolbarCurrenttimeContainer(
  props: {
    videoElement: HTMLVideoElement;
  } & (
    | {
        enableLiveMode: true;
        liveModeCurrentTime: number;
        isLive: boolean;
      }
    | {
        enableLiveMode: false | undefined;
      }
  )
) {
  const currentTime = useVideoCurrenttime(props.videoElement);

  if (props.enableLiveMode) {
    return (
      <span className="flex-xyc gap-2 ">
        <span className="rounded-full h-[12px] w-[12px] bg-red-600 block"></span>
        {props.isLive
          ? "LIVE"
          : getHMFormatCurrentTime(props.liveModeCurrentTime)}
      </span>
    );
  }

  return (
    <span className="flex-xyc gap-2">
      <span className="font-bold text-xl">
        {getHMFormatCurrentTime(currentTime)}
      </span>
      <span>/</span>
      <span>{getHMFormatCurrentTime(props.videoElement.duration || 0)}</span>
    </span>
  );
}
