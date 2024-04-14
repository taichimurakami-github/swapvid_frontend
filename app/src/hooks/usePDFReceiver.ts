import { BACKEND_SERVICES } from "@/app.config";
import { useCallback } from "react";

/**
 * FIXME: The file name and hooks name is confusing. need to be changed.
 */
export default function usePDFReceiver(apiHost: string) {
  const uploadPDF = useCallback(async (pdfFile: File, assetId?: string) => {
    return await fetch(
      `${BACKEND_SERVICES.PROTOCOL.PDF_RECEIVER}://${apiHost}:${
        BACKEND_SERVICES.PORT.PDF_RECEIVER
      }/${assetId ?? pdfFile.name.split(".")[0]}`,
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
