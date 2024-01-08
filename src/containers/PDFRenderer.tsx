import React, { useCallback, useEffect } from "react";

import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { getRangeArray } from "@utils/common";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import {
  pdfPageStateAtom,
  pdfRendererStateAtom,
  pdfSrcAtom,
} from "@/providers/jotai/swapVidPlayer";
("@/providers/jotai/swapVidPlayer");

const _PDFRenderer: React.FC<{
  pageWidthPx: number;
}> = ({ pageWidthPx }) => {
  const pdfSrc = useAtomValue(pdfSrcAtom);
  const [pdfState, setPdfState] = useAtom(pdfRendererStateAtom);
  const setPdfPageState = useSetAtom(pdfPageStateAtom);

  const handleDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setPdfState((b) => ({
        ...b,
        loaded: true,
        pageLength: numPages,
      }));
    },
    [setPdfState]
  );

  const handleDocumentLoadError = useCallback(
    () =>
      setPdfState((b) => ({
        ...b,
        loaded: false,
      })),
    [setPdfState]
  );

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  useEffect(() => {
    setPdfPageState((b) => ({
      ...b,
      width: pageWidthPx,
    })); /** Update pdfPageState.(rendered)width */
  }, [setPdfPageState, pageWidthPx]);

  return (
    <Document
      file={pdfSrc}
      onLoadSuccess={handleDocumentLoadSuccess}
      onLoadError={handleDocumentLoadError}
    >
      {getRangeArray(pdfState.pageLength, 1).map((i) => (
        <Page
          width={pageWidthPx}
          pageNumber={i}
          key={`renderedPdf_p${i}`}
          renderTextLayer
        />
      ))}
    </Document>
  );
};

export const PDFRenderer = React.memo(_PDFRenderer);
