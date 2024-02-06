import { BACKEND_SERVICES } from "@/app.config";
import { FileExplorerAPIResponse } from "@/types/backend";
import { useCallback } from "react";

export function useBackendFileExplorerApi(apiHost: string) {
  const fetchBackendAssetFiles = useCallback(async () => {
    return (await fetch(
      `${BACKEND_SERVICES.PROTOCOL.FILE_EXPLORER}://${apiHost}:${BACKEND_SERVICES.PORT.FILE_EXPLORER}/`
    )
      .then((v) => v.json())
      .catch((e) => {
        console.log(e);
        return null;
      })) as FileExplorerAPIResponse | null;
  }, []);

  return { fetchBackendAssetFiles };
}
