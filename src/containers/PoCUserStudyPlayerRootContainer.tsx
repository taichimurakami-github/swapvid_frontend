import { useSetDocumentPlayerStateCtx } from "@/hooks/useContextConsumer";
import React, { PropsWithChildren, useCallback, useState } from "react";

import DocumentPlayerCtxProvider from "@/providers/DocumentPlayerCtxProvider";
import VideoPlayerCtxProvider from "@/providers/VideoPlayerCtxProvider";
import AssetDataCtxProvider from "@/providers/AssetDataCtxProvider";

import PoCUserStudyBaselineViewContainer from "@/containers/PoCUserStudyBaselineViewContainer";
import PoCUserStudyInteractiveViewContainer from "@/containers/PoCUserStudyInteractiveViewContainer";

import { AppTopMenuContainer } from "@/containers/AppTopMenuContainer";
import { TAssetId, TInterfaceMode } from "@/@types/types";
import { ACTIVE_ASSET_ID_LS_CACHE_KEY } from "@/app.config";
import { PoCUserStudyTaskSubmissionForm } from "@/ui/PoCUserStudyTaskSubmissionForm";

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
  const [interfaceModeState, setInterfaceModeState] = useState<TInterfaceMode>(
    props.initialInterfaceMode
  );
  const [activeAssetIdState, setActiveIdState] = useState<TAssetId>(
    props.initialAssetId
  );

  const [taskSubmitFormVisible, setTaskSubmitFormVisible] = useState(false);

  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

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

  return (
    <AssetDataCtxProvider assetId={activeAssetIdState}>
      <VideoPlayerCtxProvider>
        <DocumentPlayerCtxProvider
          assetId={activeAssetIdState}
          playerMode={interfaceModeState}
        >
          <div className="app-container relative bg-neutral-800 box-border z-0 h-screen flex-xyc flex-col px-4 pt-4">
            {interfaceModeState === "parallel" && (
              <PoCUserStudyBaselineViewContainer
                assetId={activeAssetIdState}
                videoWidthPx={1280}
              />
            )}

            {interfaceModeState === "combined" && (
              <PoCUserStudyInteractiveViewContainer />
            )}

            {!props.disableAppMenu && (
              <AppTopMenuContainer
                activeAssetId={activeAssetIdState}
                handleChangeActiveAssetId={handleChangeActiveAssetId}
                handleChangeInterfaceMode={handleChangeInterfaceMode}
                hideCombinedLiveViewButton
              />
            )}
          </div>
          <button
            className="fixed left-0 bottom-0 flex-xyc w-full h-[50px] text-2xl font-bold bg-black-transparent-01 text-white hover:bg-slate-600 hover:font-bold"
            onClick={() => {
              setTaskSubmitFormVisible(true);
            }}
          >
            Click here to submit this task
          </button>

          {taskSubmitFormVisible && (
            <PoCUserStudyTaskSubmissionForm
              handleCloseForm={() => {
                setTaskSubmitFormVisible(false);
              }}
            />
          )}
        </DocumentPlayerCtxProvider>
      </VideoPlayerCtxProvider>
    </AssetDataCtxProvider>
  );
}
