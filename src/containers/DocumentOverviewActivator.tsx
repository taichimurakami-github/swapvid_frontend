import {
  documentOverviewActiveAtom,
  documentPlayerActiveAtom,
} from "@/providers/jotai/swapVidPlayer";
import { useAtom, useAtomValue } from "jotai/react";
import React, { CSSProperties } from "react";

export const DocumentOverviewActivator: React.FC<{
  width: CSSProperties["width"];
  height: CSSProperties["height"];
  zIndex?: CSSProperties["zIndex"];
}> = ({ width, height, zIndex }) => {
  const documentPlayerActive = useAtomValue(documentPlayerActiveAtom);
  const [documentOverviewActive, setDocumentOverviewActive] = useAtom(
    documentOverviewActiveAtom
  );

  if (!documentPlayerActive || documentOverviewActive) return <></>;

  return (
    <div
      className="bg-black-transparent-01 opacity-0 hover:opacity-1 absolute top-0 left-0"
      style={{
        width,
        height,
        zIndex: zIndex ?? "auto",
      }}
      onClick={() => setDocumentOverviewActive(!true)}
    ></div>
  );
};
