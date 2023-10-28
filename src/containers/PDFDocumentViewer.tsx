import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { getRangeArray } from "@/utils/common";

const PDFDocumentViewer = React.memo(function _PDFDocumentViewer(
  props: PropsWithChildren<{
    pdfSrc: string;
    pageWidth: number;
  }>
) {
  const [docNumPages, setDocNumPages] = useState<number>(0);
  const handleDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }): void => {
      setDocNumPages(numPages);
    },
    [setDocNumPages]
  );

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  return (
    <Document file={props.pdfSrc} onLoadSuccess={handleDocumentLoadSuccess}>
      {getRangeArray(docNumPages, 1).map((i) => (
        <Page width={props.pageWidth} pageNumber={i} renderTextLayer />
      ))}
    </Document>
  );
});

export default PDFDocumentViewer;
