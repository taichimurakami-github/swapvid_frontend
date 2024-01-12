import React, { useCallback, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faCircleRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { TAssetId, TInterfaceType, TMediaSourceType } from "@/types/swapvid";
import { useAtom, useAtomValue } from "jotai/react";
import { AppStatesVisualizer } from "@/containers/AppStatesVisualizer";
import {
  AppConfigContentContainer,
  AppConfigModalContainer,
} from "@/presentations/Modal";
import {
  assetIdAtom,
  assetLoaderStateAtom,
  pdfSrcAtom,
  sequenceAnalyzerEnabledAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import {
  AppConfigInput,
  AppConfigLinkItem,
  AppConfigMenuSectionContainer,
  AppConfigMultipleSelect,
  AppConfigToggle,
  TAppConfigMultipleSelectProps,
} from "@/containers/AppConfigParts";

type AppMenuContents = {
  element: JSX.Element;
  title: string;
  id: string;
}[];

type AppMenuContentsAction =
  | {
      type: "add";
      payload: {
        element: JSX.Element;
        title: string;
        id: string;
      };
    }
  | {
      type: "remove";
      payload?: number;
    }
  | {
      type: "reset";
    };

const appMenuContentsReducer = (
  state: AppMenuContents,
  action: AppMenuContentsAction
) => {
  switch (action.type) {
    case "add":
      return [...state, action.payload];

    case "remove": {
      const sliceIndex =
        action.payload && action.payload < state.length ? action.payload : 1;
      return state.slice(0, state.length - sliceIndex);
    }

    case "reset":
      return [];
  }
};

export const AppConfig: React.FC<{ zIndex?: number }> = ({ zIndex }) => {
  const [appConfigActive, toggleAppConfigActive] = useReducer((b) => !b, false);

  const [appMenuContents, dispatchAppMenuContents] = useReducer(
    appMenuContentsReducer,
    []
  );

  const handleToggleAppStatesVisualizer = useCallback(() => {
    if (
      appMenuContents.filter((v) => v.id === "app_states_visualizer").length > 0
    ) {
      dispatchAppMenuContents({
        type: "remove",
      });
      return;
    }

    dispatchAppMenuContents({
      type: "add",
      payload: {
        element: <AppStatesVisualizer active />,
        title: "State Visualizer",
        id: "app_states_visualizer",
      },
    });
  }, [appMenuContents]);

  const handleCloseAppConfig = useCallback(() => {
    dispatchAppMenuContents({ type: "reset" });
    toggleAppConfigActive();
  }, [toggleAppConfigActive, dispatchAppMenuContents]);

  if (!appConfigActive)
    return (
      <button
        id="appmenu_activator"
        className="fixed top-2 left-2 p-2 z-20"
        onClick={toggleAppConfigActive}
      >
        <FontAwesomeIcon className="text-4xl text-white" icon={faGear} />
      </button>
    );

  return (
    <AppConfigModalContainer zIndex={zIndex} handleClose={handleCloseAppConfig}>
      <h2 className="relative py-4 px-8 bg-slate-600 text-white text-2xl font-bold shadow-md shadow-neutral-400">
        <div>
          <a
            className="cursor-pointer hover:underline"
            onClick={() => {
              dispatchAppMenuContents({ type: "reset" });
            }}
          >
            App Config
          </a>
          {appMenuContents.map((v, i) => (
            <>
              <span className="mx-[1rem]">&gt;</span>
              <a
                key={v.id}
                className="cursor-pointer hover:underline"
                onClick={() => {
                  i < appMenuContents.length - 1 &&
                    dispatchAppMenuContents({
                      type: "remove",
                      payload: appMenuContents.length - i,
                    });
                }}
              >
                {v.title}
              </a>
            </>
          ))}
        </div>
        <button
          className="app-config-modal-close-btn absolute top-1/2 -translate-y-1/2 right-0 p-2"
          onClick={handleCloseAppConfig}
        >
          <FontAwesomeIcon className="text-3xl px-2" icon={faXmark} />
        </button>
      </h2>

      <AppConfigContentContainer>
        {appMenuContents.length > 0 ? (
          appMenuContents[appMenuContents.length - 1].element
        ) : (
          <div id="modal_content_root">
            <div className="grid max-w-[750px] mx-auto pb-16">
              <div className="h-[50px]"></div>
              <AppConfigMenuPlayerOptions />
              <AppConfigMenuSwapVidDesktopOptions />
              <AppConfigMenuDebugger
                toggleAppStatesVisualizer={handleToggleAppStatesVisualizer}
              />
            </div>
          </div>
        )}
      </AppConfigContentContainer>
    </AppConfigModalContainer>
  );
};

const AppConfigMenuSwapVidDesktopOptions: React.FC = () => {
  const [swapVidDesktopEnabled, setSwapVidDesktopEnabled] = useAtom(
    swapvidDesktopEnabledAtom
  );

  return (
    <AppConfigMenuSectionContainer title="SwapVid Desktop">
      <AppConfigToggle
        labelText="SwapVid Desktop"
        currentValue={swapVidDesktopEnabled}
        handleSetValue={setSwapVidDesktopEnabled}
      />
    </AppConfigMenuSectionContainer>
  );
};

const AppConfigMenuPlayerOptions: React.FC = () => {
  const [assetLoaderState, setAssetLoaderState] = useAtom(assetLoaderStateAtom);

  const [swapVidInterfaceType, setSwapVidInterfaceType] = useAtom(
    swapvidInterfaceTypeAtom
  );
  const [activeAssetId, setActiveAssetId] = useAtom(assetIdAtom);

  const [videoSrc, setVideoSrc] = useAtom(videoSrcAtom);
  const [pdfSrc, setPdfSrc] = useAtom(pdfSrcAtom);
  const [sequenceAnalyzerEnabled, setSequenceAnalyzerEnabled] = useAtom(
    sequenceAnalyzerEnabledAtom
  );

  const swapVidDesktopEnabled = useAtomValue(swapvidDesktopEnabledAtom);

  return (
    <AppConfigMenuSectionContainer title="SwapVid Player">
      {React.createElement(AppConfigMultipleSelect<TInterfaceType>, {
        currentValue: swapVidInterfaceType,
        selectElementId: "player_ui_type",
        labelText: "Player UI Type",
        options: [
          { value: "parallel", name: "Parallel" },
          { value: "combined", name: "SwapVid" },
        ],
        handleSetValue: setSwapVidInterfaceType,
      } as TAppConfigMultipleSelectProps<TInterfaceType>)}

      <AppConfigToggle
        labelText="Sequence Analyzer"
        currentValue={swapVidDesktopEnabled ? true : sequenceAnalyzerEnabled}
        handleSetValue={setSequenceAnalyzerEnabled}
        disabled={swapVidDesktopEnabled}
      />

      {/* {React.createElement(AppConfigMultipleSelect<TAssetId>, {
        currentValue: activeAssetId,
        selectElementId: "player_active_asset_id",
        labelText: "Preset Asset",
        options: [
          { value: "SampleLectureLLM01", name: "SampleLectureLLM01" },
          { value: "CHI2021Fujita", name: "CHI2021Fujita" },
          { value: "IEEEVR2022Hoshikawa", name: "IEEEVR2022Hoshikawa" },
          { value: "IEEEVR2022Ogawa", name: "IEEEVR2022Ogawa" },
          { value: "EdanMeyerVpt", name: "EdanMeyerVpt" },
          { value: "EdanMeyerAlphaCode", name: "EdanMeyerAlphaCode" },
        ],
        handleSetValue: setActiveAssetId,
      } as TAppConfigMultipleSelectProps<TAssetId>)} */}

      {/* <AppConfigInput
        labelText="Asset ID (custom)"
        currentValue={activeAssetId ?? ""}
        // @ts-ignore
        handleSetValue={setActiveAssetId}
      /> */}

      {React.createElement(AppConfigMultipleSelect<TMediaSourceType>, {
        currentValue: assetLoaderState.video.sourceType,
        selectElementId: "video_source_type",
        labelText: "Video Source Type",
        options: [
          { value: "streaming", name: "Streaming" },
          { value: "local", name: "Local File" },
        ],
        handleSetValue: (v) =>
          setAssetLoaderState((b) => ({
            ...b,
            video: { ...b.video, sourceType: v },
          })),
      } as TAppConfigMultipleSelectProps<TMediaSourceType>)}

      {/* <AppConfigToggle
        labelText="Use preset Video file"
        currentValue={
          swapVidDesktopEnabled ? true : assetLoaderState.video.presetsEnabled
        }
        handleSetValue={(v) =>
          setAssetLoaderState((b) => ({
            ...b,
            video: { ...b.video, presetsEnabled: v },
          }))
        }
        disabled={swapVidDesktopEnabled}
      /> */}

      {React.createElement(AppConfigMultipleSelect<TMediaSourceType>, {
        currentValue: assetLoaderState.pdf.sourceType,
        selectElementId: "pdf_source_type",
        labelText: "PDF Source Type",
        options: [
          { value: "streaming", name: "Streaming" },
          { value: "local", name: "Local File" },
        ],
        handleSetValue: (v) =>
          setAssetLoaderState((b) => ({
            ...b,
            pdf: { ...b.pdf, sourceType: v },
          })),
      } as TAppConfigMultipleSelectProps<TMediaSourceType>)}

      {/* <AppConfigToggle
        labelText="Use preset PDF file"
        currentValue={
          swapVidDesktopEnabled ? true : assetLoaderState.pdf.presetsEnabled
        }
        handleSetValue={(v) =>
          setAssetLoaderState((b) => ({
            ...b,
            pdf: { ...b.pdf, presetsEnabled: v },
          }))
        }
        disabled={swapVidDesktopEnabled}
      /> */}

      {typeof videoSrc === "string" && (
        <AppConfigInput
          labelText="Video Source URL"
          currentValue={videoSrc ?? ""}
          handleSetValue={setVideoSrc}
        />
      )}

      {typeof pdfSrc === "string" && (
        <AppConfigInput
          labelText="PDF Source URL"
          currentValue={pdfSrc ?? ""}
          handleSetValue={setPdfSrc}
        />
      )}
    </AppConfigMenuSectionContainer>
  );
};

const AppConfigMenuDebugger: React.FC<{
  toggleAppStatesVisualizer: () => void;
}> = ({ toggleAppStatesVisualizer }) => {
  return (
    <AppConfigMenuSectionContainer title="Debugger">
      <AppConfigLinkItem handleClick={toggleAppStatesVisualizer}>
        App States Visualizer{" "}
        <FontAwesomeIcon icon={faCircleRight} className="text-black" />
      </AppConfigLinkItem>
      <AppConfigLinkItem handleClick={toggleAppStatesVisualizer} disabled>
        Sequence Analyzer Debugger{" "}
        <FontAwesomeIcon icon={faCircleRight} className="text-black" />
      </AppConfigLinkItem>
    </AppConfigMenuSectionContainer>
  );
};
