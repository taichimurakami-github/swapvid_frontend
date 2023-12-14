import React, { PropsWithChildren } from "react";
import useSubtitles from "../hooks/useSubtitles";
import { TSubtitlesData } from "@/types/swapvid";
import { useVideoCurrenttime } from "../hooks/useVideoCurrenttime";

export default function VideoSubtitlesContainer(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    subtitlesData: TSubtitlesData;
    active: boolean;
    zIndex?: number;
  }>
) {
  const currentTime = useVideoCurrenttime(props.videoElement);
  const subtitles = useSubtitles(props.subtitlesData, currentTime);

  return (
    <>
      {props.active &&
        subtitles.length === 2 &&
        (subtitles[0] || subtitles[1]) && (
          <div
            className="p-1 absolute bottom-[5px] left-1/2 -translate-x-1/2 pointer-events-none bg-black text-white text-xl"
            style={{
              zIndex: props?.zIndex ?? 10,
            }}
          >
            {subtitles
              .filter((v) => Boolean(v))
              .map((subtitleStr) => (
                <p className="select-none">{subtitleStr}</p>
              ))}
          </div>
        )}
    </>
  );
}
