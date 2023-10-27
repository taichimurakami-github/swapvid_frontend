import { TAssetId, TBoundingBox } from "@/@types/types";
import { SEQUENCE_ANALYZER_API_ENDPOINT } from "@/app.config";
import { useCallback, useEffect, useRef } from "react";

export type SequenceAnalyzerOkResponseBody = {
  estimated_viewport: TBoundingBox | null;
  matched_content_vf: string | null;
  matched_content_doc: string | null;
  score_ngram: number;
  score_sqmatch: number;
};

export type SequenceAnalyzerErrorResponseBody = {
  error_type: string;
  error_message: string;
};

type MatchContentSequenceResult =
  | {
      status: "OK";
      bodyContent: SequenceAnalyzerOkResponseBody;
    }
  | {
      status: "ERROR";
      bodyContent: SequenceAnalyzerErrorResponseBody;
    };

export default function useSequenceAnalyzer(
  assetId: TAssetId,
  videoElement: HTMLVideoElement
) {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const prevResReseived = useRef(true);
  const prevResContent = useRef<null | MatchContentSequenceResult>(null);
  const prevSampledCurrentTime = useRef<number>(-Infinity);

  const _showSentFrameImage = useCallback((frame_src_dataurl: string) => {
    const img: HTMLImageElement | null = document.querySelector(
      "#frame_capture_showcase"
    );

    if (img) {
      img.src = frame_src_dataurl;
    }
  }, []);

  const _showMatchResult = useCallback((matchResult: TBoundingBox | null) => {
    const showcase: HTMLParagraphElement | null = document.querySelector(
      "#sqa_resp_estimated_viewport_showcase"
    );

    if (!showcase) return;

    showcase.innerHTML = JSON.stringify(matchResult);
  }, []);

  const _showMatchScore = useCallback(
    (ngramScore: number, sqmatchScore: number) => {
      const showcase: HTMLParagraphElement | null = document.querySelector(
        "#sqa_content_match_score_showcase"
      );

      if (!showcase) return;

      const totalScore = `${(100 * (ngramScore + sqmatchScore)) / 2}%`;
      const showcaseContent = `${totalScore} (ngram=${ngramScore}, sqmatch=${sqmatchScore})`;

      showcase.innerHTML = JSON.stringify(showcaseContent);
    },
    []
  );

  const _showMatchContent = useCallback(
    (
      contentFromVideoFrame: string,
      contentFromDocument: string,
      currentResponseTime: number
    ) => {
      const vf_content_showcase: HTMLParagraphElement | null =
        document.querySelector("#sqa_video_content_showcase");
      const doc_content_showcase: HTMLParagraphElement | null =
        document.querySelector("#sqa_document_content_showcase");

      const sqa_response_time_showcase: HTMLParagraphElement | null =
        document.querySelector("#sqa_response_time_showcase");

      if (
        !vf_content_showcase ||
        !doc_content_showcase ||
        !sqa_response_time_showcase
      )
        return;

      vf_content_showcase.innerText = JSON.stringify(contentFromVideoFrame);
      doc_content_showcase.innerText = JSON.stringify(contentFromDocument);
      sqa_response_time_showcase.innerText = String(currentResponseTime);
    },
    []
  );

  const _getImgDataURLFromVideoSource = useCallback((): string | null => {
    canvasRef.current.width = videoElement.videoWidth;
    canvasRef.current.height = videoElement.videoHeight;

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight
    );

    const imgDataURL = canvasRef.current.toDataURL();

    return imgDataURL;
  }, [videoElement, canvasRef]);

  const matchContentSequence = useCallback(
    async (imgDataURL: string): Promise<MatchContentSequenceResult | null> => {
      // If the previous request is not finished, return the previous result
      if (!prevResReseived.current) return prevResContent.current;

      // Make a flag for preventing multiple requests
      prevResReseived.current = false;

      /** TODO: エラーレスポンスのハンドリング */
      const requestURL = SEQUENCE_ANALYZER_API_ENDPOINT + assetId;
      const result = await fetch(requestURL, {
        method: "POST",
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
        body: imgDataURL,
      })
        .then(async (res) => {
          const bodyContent = await res.json();

          const result =
            res.status === 200
              ? {
                  status: "OK",
                  bodyContent: bodyContent as SequenceAnalyzerOkResponseBody, // Content of request.body
                }
              : {
                  status: "ERROR",
                  bodyContent: bodyContent as SequenceAnalyzerErrorResponseBody,
                };

          return result as MatchContentSequenceResult;
        })
        .catch((e) => {
          console.error(e);
          return null;
        })
        .finally(() => {
          // Turn off the flag
          prevResReseived.current = true;
        });

      // Save the result
      prevResContent.current = result;

      return result;
    },
    [assetId, prevResReseived, prevResContent]
  );

  const matchContentSequenceOnVideoTimeUpdate = useCallback(
    async (currentTime: number, samplingRate_sec = 3.0) => {
      const timeDiff = Math.abs(currentTime - prevSampledCurrentTime.current);

      if (timeDiff < samplingRate_sec) return prevResContent.current;

      prevSampledCurrentTime.current = currentTime;

      const imgDataURL = _getImgDataURLFromVideoSource();

      if (!imgDataURL) return null;

      _showSentFrameImage(imgDataURL);

      const serverResponsePrevSentTime = Date.now();
      const result = await matchContentSequence(imgDataURL);
      const serverResponseReceivedTime = Date.now();

      if (result && result.status === "OK") {
        _showMatchResult(result.bodyContent.estimated_viewport);
        _showMatchContent(
          result.bodyContent.matched_content_vf as string,
          result.bodyContent.matched_content_doc as string,
          serverResponseReceivedTime - serverResponsePrevSentTime
        );
        _showMatchScore(
          result.bodyContent.score_ngram,
          result.bodyContent.score_sqmatch
        );
      }

      return result;
    },
    [
      matchContentSequence,
      _showSentFrameImage,
      _showMatchResult,
      _showMatchContent,
      _showMatchScore,
      _getImgDataURLFromVideoSource,
    ]
  );

  useEffect(() => {
    prevResReseived.current = true;
    prevResContent.current = null;
  }, [assetId, videoElement]);

  return {
    matchContentSequence,
    matchContentSequenceOnVideoTimeUpdate,
  };
}
