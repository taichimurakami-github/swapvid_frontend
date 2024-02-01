import { FILE_EXPLORER_API_ENDPOINT_HTTP } from "@/app.config";
import { FileExplorerAPIResponse } from "@/types/backend";
import { useCallback } from "react";

export function useBackendFileExplorerApi() {
  const fetchBackendAssetFiles = useCallback(async () => {
    return (await fetch(FILE_EXPLORER_API_ENDPOINT_HTTP)
      .then((v) => v.json())
      .catch((e) => {
        console.log(e);
        return null;
      })) as FileExplorerAPIResponse | null;
  }, []);

  return { fetchBackendAssetFiles };
}
