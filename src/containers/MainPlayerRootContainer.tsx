import React, { PropsWithChildren, useCallback, useState } from "react";
import { TAssetId, TInterfaceMode } from "@/types/swapvid";
import { ACTIVE_ASSET_ID_LS_CACHE_KEY } from "@/app.config";

import DocumentPlayerCtxProvider from "@providers/DocumentPlayerCtxProvider";
import VideoPlayerCtxProvider from "@providers/VideoPlayerCtxProvider";
import AssetDataCtxProvider from "@providers/AssetDataCtxProvider";

import { useSetDocumentPlayerStateCtx } from "@hooks/useContextConsumer";

import MainPlayerParallelViewContainer from "@containers/MainPlayerParallelViewContainer";
import MainPlayerCombinedViewLocalContainer from "@containers/MainPlayerCombinedViewLocalContainer";
import MainPlayerCombinedViewLiveContainer from "@containers/MainPlayerCombinedViewLiveContainer";
import { AppTopMenuContainer } from "@containers/AppTopMenuContainer";

export const MainPlayerRootContainer = (
  props: PropsWithChildren<{
    initialInterfaceMode: TInterfaceMode;
    initialAssetId: TAssetId;
    onUmmounted?: () => void;
    onMounted?: () => void;

    t?: number;
    autoPlay?: boolean;
    enableOverflowModeOnCombinedView?: boolean;
    disableSeekbar?: boolean;
    disableControlPanelMuted?: boolean;
    disableControlPanelPauseAndPlay?: boolean;
    disableControlPanelSubtilte?: boolean;
    disablePauseAndPlay?: boolean;
    disableAppMenu?: boolean;
  }>
) => {
  const [interfaceModeState, setInterfaceModeState] =
    useState<TInterfaceMode>("combined-ls");
  const [activeAssetIdState, setActiveIdState] = useState<TAssetId>(
    props.initialAssetId
  );
  // const [isFullScreen, setIsFullScreen] = useState(false);

  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  // const handleOnChangeInterfaceMode = useCallback(
  //   (nextInterfaceState: TInterfaceMode) => {
  //     setInterfaceModeState(nextInterfaceState);
  //   },
  //   []
  // );

  const handleChangeInterfaceMode = useCallback(
    (value: TInterfaceMode) => {
      setInterfaceModeState(value);
    },
    [setInterfaceModeState]
  );

  const handleChangeActiveAssetId = useCallback(
    (assetId: TAssetId) => {
      setActiveIdState(assetId);
      localStorage.setItem(ACTIVE_ASSET_ID_LS_CACHE_KEY, assetId);
      setDocumentPlayerStateValues({ active: false });
      // location.reload();
    },
    [setActiveIdState, setDocumentPlayerStateValues]
  );

  // const handleFullScreen = useCallback(() => {
  //   const screenState = isFullScreen
  //     ? document.exitFullscreen()
  //     : document.body.requestFullscreen();
  //   screenState.then((_) => setIsFullScreen((b) => !b));
  // }, [isFullScreen, setIsFullScreen]);

  // const handleSetActiveAssetId = useCallback(
  //   (v: TAssetId) => setActiveIdState(v),
  //   [setActiveIdState]
  // );

  // const handleClickNewAssetButton = useCallback(
  //   (e: React.MouseEvent<HTMLAnchorElement>) => {
  //     if (e.currentTarget.id) {
  //       const newAssetId = e.currentTarget.id as TAssetId;
  //       handleSetActiveAssetId(newAssetId);
  //     }
  //   },
  //   [handleSetActiveAssetId]
  // );

  return (
    <AssetDataCtxProvider assetId={activeAssetIdState}>
      <VideoPlayerCtxProvider>
        <DocumentPlayerCtxProvider
          assetId={activeAssetIdState}
          playerMode={interfaceModeState}
        >
          <div className="app-container relative bg-neutral-800 box-border z-0 h-screen flex-xyc flex-col px-4 pt-4">
            {interfaceModeState === "parallel" && (
              <MainPlayerParallelViewContainer />
            )}

            {interfaceModeState === "combined" && (
              <MainPlayerCombinedViewLocalContainer
                assetId={activeAssetIdState}
                enableOverflowMode={props.enableOverflowModeOnCombinedView}
              />
            )}

            {interfaceModeState === "combined-ls" && (
              <MainPlayerCombinedViewLiveContainer
                assetId={activeAssetIdState}
                enableOverflowMode={props.enableOverflowModeOnCombinedView}
              />
            )}

            {props.disableAppMenu && <div className="h-[15vh]"></div>}

            {!props.disableAppMenu && (
              <AppTopMenuContainer
                activeAssetId={activeAssetIdState}
                handleChangeActiveAssetId={handleChangeActiveAssetId}
                handleChangeInterfaceMode={handleChangeInterfaceMode}
              />
            )}
          </div>
        </DocumentPlayerCtxProvider>
      </VideoPlayerCtxProvider>
    </AssetDataCtxProvider>
  );
};
