import { MainPlayerRootContainer } from "@containers/MainPlayerRootContainer";
import { TAssetId, TInterfaceMode } from "@/types/swapvid";
import {
  ACTIVE_ASSET_ID_LS_CACHE_KEY,
  ACTIVE_VIEW_MODE_LS_CACHE_KEY,
} from "@/app.config";
import PoCUserStudyPlayerRootContainer from "@containers/PoCUserStudyPlayerRootContainer";

const defaultAssetId: TAssetId = "EdanMeyerVpt";
const defaultInterfaceMode: TInterfaceMode = "combined";

export type TAppMode = "PoCUserStudy" | "SwapVid";

const APP_MODE: TAppMode = "SwapVid";
// const APP_MODE: TAppMode = "PoCUserStudy";

export default function App() {
  const initialInterfaceMode =
    (localStorage.getItem(ACTIVE_VIEW_MODE_LS_CACHE_KEY) as TInterfaceMode) ??
    defaultInterfaceMode;
  const initialAssetId =
    (localStorage.getItem(ACTIVE_ASSET_ID_LS_CACHE_KEY) as TAssetId) ??
    defaultAssetId;

  switch (APP_MODE) {
    case "SwapVid":
      return (
        <MainPlayerRootContainer
          initialInterfaceMode={initialInterfaceMode}
          initialAssetId={initialAssetId}
          enableOverflowModeOnCombinedView={false}
          disableAppMenu={false}
        />
      );

    case "PoCUserStudy":
      return (
        <PoCUserStudyPlayerRootContainer
          initialInterfaceMode={initialInterfaceMode}
          initialAssetId={initialAssetId}
          enableOverflowModeOnCombinedView={false}
        />
      );
  }
}
