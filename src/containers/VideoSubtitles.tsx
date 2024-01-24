import React, { useMemo } from "react";
import useSubtitles from "@/hooks/useSubtitles";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import {
  subtitlesActiveAtom,
  subtitlesDataAtom,
  videoElementRefAtom,
} from "@/providers/jotai/store";
import { useAtomValue } from "jotai/react";

export const VideoSubtitles: React.FC = () => {
  const videoElementRef = useAtomValue(videoElementRefAtom);
  const subtitlesData = useAtomValue(subtitlesDataAtom);
  const subtitlesActive = useAtomValue(subtitlesActiveAtom);

  const currentTime = useVideoCurrenttime(videoElementRef);
  const subtitles = useSubtitles(subtitlesData, currentTime);

  const active = useMemo(
    () => subtitlesActive && subtitlesData && subtitlesData.length > 0,
    [subtitlesActive, subtitlesData]
  );

  return (
    <div
      className="p-1 absolute bottom-[5px] left-1/2 -translate-x-1/2 pointer-events-none bg-black text-white text-xl"
      style={{
        display: active ? "block" : "none",
      }}
    >
      {subtitles
        .filter((v) => Boolean(v))
        .map((subtitleStr) => (
          <p className="select-none">{subtitleStr}</p>
        ))}
    </div>
  );
};
