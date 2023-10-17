import { TAssetId, TBoundingBox } from "@/@types/types";
import { useCallback, useEffect, useRef } from "react";

type SequenceAnalyzerResponse = {
  matching_result: TBoundingBox | null;
};

export default function useSequenceAnalyzer(
  assetId: TAssetId,
  videoElement: HTMLVideoElement
) {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const prevResReseived = useRef(true);
  const prevResContent = useRef<null | SequenceAnalyzerResponse>();

  const showSentFrameImage = useCallback((videoElement: HTMLVideoElement) => {
    const canvas: HTMLCanvasElement | null = document.querySelector(
      "#frame_capture_showcase"
    );

    if (canvas) {
      canvas.width = 640;
      canvas.height = 360;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const showMatchResult = useCallback((matchResult: TBoundingBox | null) => {
    const showcase: HTMLDivElement | null = document.querySelector(
      "#sqa_response_showcase"
    );

    if (!showcase) return;

    showcase.innerHTML = JSON.stringify(matchResult);
  }, []);

  const matchContentSequence = useCallback(async () => {
    if (!prevResReseived.current) return prevResContent.current;

    prevResReseived.current = false;

    canvasRef.current.width = 1280;
    canvasRef.current.height = 720;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return null;

    showSentFrameImage(videoElement);

    ctx.drawImage(
      videoElement,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const imgDataUrl = canvasRef.current.toDataURL();

    const result: SequenceAnalyzerResponse = await fetch(
      `http://localhost:8881/${assetId}`,
      {
        method: "POST",
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
        body: imgDataUrl,
      }
    ).then((res) => res.json());

    showMatchResult(result.matching_result);

    prevResReseived.current = true;
    prevResContent.current = result;

    return result;
  }, [videoElement, assetId, canvasRef, showSentFrameImage, showMatchResult]);

  useEffect(() => {
    prevResReseived.current = true;
    prevResContent.current = null;
  }, [assetId, videoElement]);

  return {
    matchContentSequence,
  };
}
