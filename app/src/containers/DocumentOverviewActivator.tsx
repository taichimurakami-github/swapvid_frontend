import {
  documentOverviewActiveAtom,
  documentPlayerActiveAtom,
} from "@/providers/jotai/store";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  return (
    <div
      className="flex-xyc flex-col gap-2 absolute top-0 left-0 bg-black cursor-pointer opacity-0 hover:opacity-90 text-white text-3xl"
      style={{
        width,
        height,
        zIndex: zIndex ?? "auto",
        visibility:
          documentPlayerActive && !documentOverviewActive
            ? "visible"
            : "hidden",
      }}
      onClick={() => setDocumentOverviewActive(true)}
    >
      <FontAwesomeIcon icon={faFileInvoice} />
      <span>&gt;&gt;</span>
    </div>
  );
};
