import { useCallback } from "react";
import { PDF_RECEIVER_API_ENDPOINT_HTTP } from "@/app.config";

/**
 * FIXME: The file name and hooks name is confusing. need to be changed.
 */
export default function usePDFReceiver() {
  const uploadPDF = useCallback(async (pdfFile: File, assetId?: string) => {
    return await fetch(
      PDF_RECEIVER_API_ENDPOINT_HTTP + (assetId ?? pdfFile.name.split(".")[0]),
      {
        method: "POST",
        headers: {
          "content-type": "application/pdf",
        },
        body: pdfFile,
      }
    );
  }, []);
  return { uploadPDF };
}
