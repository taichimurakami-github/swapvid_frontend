import { MainPlayerRootContainer } from "@/containers/MainPlayerRootContainer";
import { TAssetId } from "@/@types/types";
import { ACTIVE_ASSET_ID_LS_CACHE_KEY } from "@/app.config";
import PoCUserStudyPlayerRootContainer from "@/containers/PoCUserStudyPlayerRootContainer";

const defaultAssetId = "EdanMeyerVpt";
const defaultInterfaceMode = "combined";

export type TAppMode = "PoCUserStudy" | "SwapVid";

// const APP_MODE: TAppMode = "SwapVid";
const APP_MODE: TAppMode = "PoCUserStudy";

export default function App() {
  switch (APP_MODE) {
    case "SwapVid":
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

    case "PoCUserStudy":
      return (
        <PoCUserStudyPlayerRootContainer
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
}
