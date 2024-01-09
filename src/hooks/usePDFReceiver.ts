import { useCallback } from "react";
import { PDF_RECEIVER_API_ENDPOINT_HTTP } from "@/app.config";

export default function usePDFReceiver() {
  const uploadPDF = useCallback(async (pdf: File, assetId: string) => {
    return await fetch(PDF_RECEIVER_API_ENDPOINT_HTTP + assetId, {
      method: "POST",
      headers: {
        "content-type": "application/pdf",
      },
      body: pdf,
    });
  }, []);
  return { uploadPDF };
}
