import React, { useCallback, useState } from "react";
import { useDocumentPlayerStateCtx } from "@hooks/useContextConsumer";

export default function DebugInfoDialogDocumentCtxContainer() {
  const documentPlayerState = useDocumentPlayerStateCtx();
  const [showcaseActive, setShowcaseActive] = useState(false);

  const handleShowcaseActive = useCallback(() => {
    setShowcaseActive((b) => !b);
  }, [setShowcaseActive]);

  return (
    <div className="flex-xyc">
      <button
        className="bg-slate-600 text-white font-bold text-xl p-2"
        onClick={handleShowcaseActive}
      >
        [DEBUG] DocumentState
      </button>

      {showcaseActive && (
        <div className="grid p-2 bg-gray-600 text-white text-lg fixed top-0 right-0 w-[50%] h-full opacity-80 overflow-auto pointer-events-none">
          <h2 className="p-2 font-bold text-xl text-center">
            Current docuentPlayerState
          </h2>
          {Object.entries(documentPlayerState).map(([key, value]) => {
            return (
              <div className="flex gap-4">
                <p>{key}</p>
                <p>{JSON.stringify(value)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
