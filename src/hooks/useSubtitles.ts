import React from "react";

type TSubtitlesData = {
  id: number;
  startAt: number;
  endAt: number;
  subtitle: string;
}[];

export default function useSubtitles(
  subtitlesData: TSubtitlesData | null,
  currentTime: number
) {
  if (!subtitlesData || subtitlesData.length === 0) {
    return [null, null];
  }

  const currentSubtitleLoadResult = subtitlesData.filter(
    (v) => v.startAt <= currentTime && currentTime < v.endAt
  );

  //取得失敗
  if (currentSubtitleLoadResult.length !== 1) {
    return [null, null];
  }

  const currentDataId = currentSubtitleLoadResult[0].id - 1;

  if (currentDataId + 1 === subtitlesData.length) {
    return [subtitlesData[currentDataId].subtitle, null];
  }

  return currentDataId % 2 === 1
    ? [
        subtitlesData[currentDataId - 1].subtitle,
        subtitlesData[currentDataId].subtitle,
      ]
    : [
        subtitlesData[currentDataId].subtitle,
        subtitlesData[currentDataId + 1].subtitle,
      ];
}
