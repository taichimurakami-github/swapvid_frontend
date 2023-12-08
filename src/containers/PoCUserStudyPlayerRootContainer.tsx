import { useSetDocumentPlayerStateCtx } from "@/hooks/useContextConsumer";
import React, { PropsWithChildren, useCallback, useState } from "react";

import DocumentPlayerCtxProvider from "@/providers/DocumentPlayerCtxProvider";
import VideoPlayerCtxProvider from "@/providers/VideoPlayerCtxProvider";
import AssetDataCtxProvider from "@/providers/AssetDataCtxProvider";

import PoCUserStudyBaselineViewContainer from "@/containers/PoCUserStudyBaselineViewContainer";
import PoCUserStudyInteractiveViewContainer from "@/containers/PoCUserStudyInteractiveViewContainer";

import { AppTopMenuContainer } from "@/containers/AppTopMenuContainer";
import { TAssetId, TInterfaceMode } from "@/@types/types";
import { ACTIVE_ASSET_ID_LS_CACHE_KEY, UIELEM_ID_LIST } from "@/app.config";

export default function PoCUserStudyPlayerRootContainer(
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
) {
  const [interfaceModeState, setInterfaceModeState] =
    useState<TInterfaceMode>("parallel");
  const [activeAssetIdState, setActiveIdState] = useState<TAssetId>(
    props.initialAssetId
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [assetChangeFormVisible, setAssetChangeFormVisible] = useState(false);
  const [taskSubmitFormVisible, setTaskSubmitFormVisible] = useState(false);

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

  return (
    <AssetDataCtxProvider assetId={activeAssetIdState}>
      <VideoPlayerCtxProvider>
        <DocumentPlayerCtxProvider
          assetId={activeAssetIdState}
          playerMode={interfaceModeState}
        >
          <div className="app-container relative bg-neutral-800 box-border z-0 h-screen flex-xyc flex-col px-4 pt-4">
            {interfaceModeState === "parallel" && (
              <PoCUserStudyBaselineViewContainer />
            )}

            {interfaceModeState === "combined" && (
              <PoCUserStudyInteractiveViewContainer />
            )}

            {!props.disableAppMenu && (
              <AppTopMenuContainer
                activeAssetId={activeAssetIdState}
                handleChangeActiveAssetId={handleChangeActiveAssetId}
                handleChangeInterfaceMode={handleChangeInterfaceMode}
              />
            )}
          </div>
          <div
            className="fixed left-0 bottom-0 flex-xyc w-full h-[50px] text-2xl font-bold bg-black-transparent-01 text-white hover:bg-slate-600 hover:font-bold"
            onClick={() => {
              setTaskSubmitFormVisible(true);
            }}
          >
            Click here to submit this task
          </div>

          {taskSubmitFormVisible && (
            <div
              id={UIELEM_ID_LIST.system.taskPlayer.taskSubmitFormWrapper}
              className="absolute top-0 left-0 w-full h-full bg-black-transparent-01 flex-xyc"
              onClick={() => {
                setTaskSubmitFormVisible(false);
              }}
            >
              <div className="bg-gray-200 rounded-md p-[50px] font-bold text-xl">
                <h3 className="mb-10">Are you sure to submit this task?</h3>
                <div className="flex justify-evenly gap-8 text-white w-full">
                  <button
                    className="rounded-full bg-red-600 p-4 min-w-[100px]"
                    onClick={() => {
                      setTaskSubmitFormVisible(false);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="rounded-full bg-gray-500 p-4 min-w-[100px]"
                    onClick={() => {
                      setTaskSubmitFormVisible(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </DocumentPlayerCtxProvider>
      </VideoPlayerCtxProvider>
    </AssetDataCtxProvider>
  );
}
