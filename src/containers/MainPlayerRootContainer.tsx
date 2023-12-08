import React, { PropsWithChildren, useCallback, useState } from "react";
import { TAssetId, TInterfaceMode } from "@/@types/types";
import { ACTIVE_ASSET_ID_LS_CACHE_KEY } from "@/app.config";

import DocumentPlayerCtxProvider from "@/providers/DocumentPlayerCtxProvider";
import VideoPlayerCtxProvider from "@/providers/VideoPlayerCtxProvider";
import AssetDataCtxProvider from "@/providers/AssetDataCtxProvider";

import { useSetDocumentPlayerStateCtx } from "@/hooks/useContextConsumer";

import MainPlayerParallelViewContainer from "@/containers/MainPlayerParallelViewContainer";
import MainPlayerCombinedViewContainer from "@/containers/MainPlayerCombinedViewODContainer";
import MainPlayerCombinedViewLSContainer from "@/containers/MainPlayerCombinedViewLSContainer";
import { AppTopMenuContainer } from "@/containers/AppTopMenuContainer";

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
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [assetChangeFormVisible, setAssetChangeFormVisible] = useState(false);

  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  // const handleOnChangeInterfaceMode = useCallback(
  //   (nextInterfaceState: TInterfaceMode) => {
  //     setInterfaceModeState(nextInterfaceState);
  //   },
  //   []
  // );

  const handleChangeAssetSelectFormActive = useCallback(
    (value?: boolean) => {
      setAssetChangeFormVisible((b) => (value !== undefined ? value : !b));
    },
    [setAssetChangeFormVisible]
  );

  const handleChangeInterfaceMode = useCallback(
    (value: TInterfaceMode) => {
      setInterfaceModeState(value);
    },
    [setInterfaceModeState]
  );

  const handleChangeActiveAssetId = useCallback(
    (assetId: TAssetId) => {
      setAssetChangeFormVisible(false);
      setActiveIdState(assetId);
      localStorage.setItem(ACTIVE_ASSET_ID_LS_CACHE_KEY, assetId);
      setDocumentPlayerStateValues({ active: false });
      // location.reload();
    },
    [setAssetChangeFormVisible, setActiveIdState, setDocumentPlayerStateValues]
  );

  const handleFullScreen = useCallback(() => {
    const screenState = isFullScreen
      ? document.exitFullscreen()
      : document.body.requestFullscreen();
    screenState.then((_) => setIsFullScreen((b) => !b));
  }, [isFullScreen, setIsFullScreen]);

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
              <MainPlayerParallelViewContainer assetId={activeAssetIdState} />
            )}

            {interfaceModeState === "combined" && (
              <MainPlayerCombinedViewContainer
                assetId={activeAssetIdState}
                enableOverflowMode={props.enableOverflowModeOnCombinedView}
              />
            )}

            {interfaceModeState === "combined-ls" && (
              <MainPlayerCombinedViewLSContainer
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
