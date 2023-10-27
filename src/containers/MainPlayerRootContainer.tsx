import React, { PropsWithChildren, useCallback, useState } from "react";
import { TAssetId, TInterfaceMode } from "@/@types/types";
import MainPlayerParallelViewContainer from "./MainPlayerParallelViewContainer";
import MainPlayerCombinedViewContainer from "./MainPlayerCombinedViewODContainer";
import DocumentPlayerCtxProvider from "@/providers/DocumentPlayerCtxProvider";
import VideoPlayerCtxProvider from "@/providers/VideoPlayerCtxProvider";
import AssetDataCtxProvider from "@/providers/AssetDataCtxProvider";
import { ACTIVE_ASSET_ID_LS_CACHE_KEY, ASSET_ID_LIST } from "@/app.config";
import { useSetDocumentPlayerStateCtx } from "@/hooks/useContextConsumer";
import MainPlayerCombinedViewLSContainer from "./MainPlayerCombinedViewLSContainer";

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
    useState<TInterfaceMode>("combined");
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

  const handleOnClickAssetChangeFormVisibleBtn = useCallback(() => {
    setAssetChangeFormVisible((b) => !b);
  }, [setAssetChangeFormVisible]);

  const handleOnChangeAssetState = useCallback(
    (assetId: TAssetId) => {
      setAssetChangeFormVisible(false);
      setActiveIdState(assetId);
      localStorage.setItem(ACTIVE_ASSET_ID_LS_CACHE_KEY, assetId);
      setDocumentPlayerStateValues({ active: false });
      // location.reload();
    },
    [setAssetChangeFormVisible, setActiveIdState]
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
              <div className="absolute top-0 left-0 flex-xyc gap-4 text-center text-white text-md p-2">
                <h1 className="flex-xyc gap-4 bg-neutral-800 text-center text-white">
                  <p className="flex-xyc gap-2">
                    Playing: <b>{activeAssetIdState}</b>
                  </p>
                  <button
                    className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
                    onClick={handleOnClickAssetChangeFormVisibleBtn}
                  >
                    Change Asset
                  </button>
                  <button
                    className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
                    onClick={handleFullScreen}
                  >
                    {isFullScreen ? "Exit full screen" : "Request full screen"}
                  </button>
                </h1>
                {/* <button
                className={
                  interfaceModeState === "parallel"
                    ? "p-2 rounded-md font-bold bg-red-600 cursor-auto"
                    : "p-2 rounded-md font-bold hover:bg-slate-500"
                }
                onClick={() => {
                  handleOnChangeInterfaceMode("parallel");
                }}
              >
                Parallel View
              </button>
              <button
                className={
                  interfaceModeState === "combined"
                    ? "p-2 rounded-md font-bold bg-red-600 cursor-auto"
                    : "p-2 rounded-md font-bold hover:bg-slate-500"
                }
                onClick={() => {
                  handleOnChangeInterfaceMode("combined");
                }}
              >
                Combined View
              </button> */}
              </div>
            )}
          </div>
          {assetChangeFormVisible && (
            <div
              className="absolute z-90 top-0 left-0 w-full h-full bg-black-transparent-01 flex-xyc"
              onClick={handleOnClickAssetChangeFormVisibleBtn}
            >
              <div
                className="bg-gray-200 rounded-md p-[50px] font-bold text-xl text-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <h3 className="mb-10">
                  <p className="font-bold underline">
                    表示する動画素材を選んでください
                  </p>
                </h3>
                <ul className="grid gap-4 text-2xl">
                  {ASSET_ID_LIST.map((v) => (
                    <button
                      id={`new_asset_selector#${v}`}
                      className={`p-2 ${
                        activeAssetIdState === v
                          ? "bg-gray-400 text-white pointer-events-none"
                          : "hover:bg-slate-600 hover:text-white"
                      }
                      `}
                      onClick={() => {
                        handleOnChangeAssetState(v as TAssetId);
                      }}
                    >
                      {v}
                      {activeAssetIdState === v && " (playing)"}
                    </button>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DocumentPlayerCtxProvider>
      </VideoPlayerCtxProvider>
    </AssetDataCtxProvider>
  );
};
