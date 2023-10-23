import { useDocumentPlayerStateCtx } from "@/hooks/useContextConsumer";
import React, { useCallback, useState } from "react";

export default function DebugInfoDialogSqaRespContainer() {
  const documentPlayerState = useDocumentPlayerStateCtx();
  const [showcaseActive, setShowcaseActive] = useState(false);

  const handleShowcaseActive = useCallback(() => {
    setShowcaseActive((b) => !b);
  }, [setShowcaseActive]);

  return (
    <div className="flex-xyc text-xl text-white">
      <button
        className="bg-slate-600 font-bold p-2 "
        onClick={handleShowcaseActive}
      >
        [DEBUG] Show Sequence Analyzer Response
      </button>

      {
        <div
          style={{ visibility: showcaseActive ? "visible" : "hidden" }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.8)] rounded-md p-2 border-white border-2 mx-auto grid gap-8 text-center"
          onClick={handleShowcaseActive}
        >
          <div className="grid gap-2">
            <p className="font-bold underline">Frame currently sent:</p>
            <img id="frame_capture_showcase" className="block mx-auto"></img>
          </div>

          <div className="grid gap-2">
            <p className="font-bold underline">Server response time (ms):</p>
            <p id="sqa_response_time_showcase" className="text-2xl"></p>
          </div>

          <div className="grid gap-2">
            <p className="font-bold underline">Match location:</p>
            <p id="sqa_resp_estimated_viewport_showcase"></p>
          </div>

          <div className="grid gap-2">
            <p className="font-bold underline">Matched content (video):</p>
            <p id="sqa_video_content_showcase"></p>
          </div>

          <div className="grid gap-2">
            <p className="font-bold underline">Matched content (document):</p>
            <p id="sqa_document_content_showcase"></p>
          </div>

          <div className="grid gap-2">
            <p className="font-bold underline">match_score:</p>
            <p id="sqa_content_match_score_showcase"></p>
          </div>
        </div>
      }
    </div>
  );
}
