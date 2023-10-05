import React from "react";
import { MainPlayerRootContainer } from "./containers/MainPlayerRootContainer";
import { TAssetId } from "./@types/types";
import { ACTIVE_ASSET_ID_LS_CACHE_KEY } from "./app.config";

const defaultAssetId = "EdanMeyerVpt";
const defaultInterfaceMode = "combined";

export default function App() {
  return (
    <MainPlayerRootContainer
      initialInterfaceMode={defaultInterfaceMode}
      initialAssetId={
        (localStorage.getItem(ACTIVE_ASSET_ID_LS_CACHE_KEY) as TAssetId) ??
        defaultAssetId
      }
      enableOverflowModeOnCombinedView={false}
      disableAppMenu={false}
    />
  );
}
