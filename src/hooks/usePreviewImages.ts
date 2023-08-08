import React, { useCallback } from "react";

export default function usePreviewImages(previewImagesSrc: string[] | null) {
  const getPreviewImagesFromSec = useCallback(
    (time_sec: number) => {
      if (!previewImagesSrc || time_sec >= previewImagesSrc.length) {
        console.error("E_NO_SRC_FOR_CURRENTTIME");
        return "";
      }

      return previewImagesSrc[time_sec];
    },
    [previewImagesSrc]
  );

  return { getPreviewImagesFromSec };
}
