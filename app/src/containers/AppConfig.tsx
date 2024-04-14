import React, { useCallback, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { TInterfaceType } from "@/types/swapvid";
import { useAtom } from "jotai/react";
import { AppStatesVisualizer } from "@/containers/AppStatesVisualizer";
import {
  sequenceAnalyzerEnabledAtom,
  backendServiceHostAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
  videoSrcAtom,
} from "@/providers/jotai/store";
import {
  AppConfigContentContainer,
  AppConfigModalContainer,
} from "@/presentations/Modal";
import {
  AppConfigInput,
  AppConfigLinkItem,
  AppConfigMenuSectionContainer,
  AppConfigMultipleSelect,
  TAppConfigMultipleSelectProps,
} from "@/containers/AppConfigParts";
import {
  AppConfigActivatorButton,
  AppConfigToggle,
} from "@/presentations/Button";
import { PdfUplorder } from "./PDFUplorder";
import { LocalAssetRegistrationForm } from "./LocalAssetPicker";
import { sequenceAnalyzerSyncIntervalMsAtom } from "@/providers/jotai/config";

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

const APP_CONFIG_CHILD_ITEM = {
  STATE_VISUALIZER: {
    id: "app_states_visualizer",
    title: "States Visualizer",
  },
  PDF_UPLOADER: {
    id: "pdf_uploader",
    title: "PDF Uploader",
  },
  LOCAL_ASSET_PICKER: {
    id: "local_asset_picker",
    title: "Asset Picker",
  },
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

export const AppConfig: React.FC<{
  zIndex?: number;
  childContent?: {
    element: JSX.Element;
    title: string;
    id: string;
  };
}> = ({ zIndex, childContent }) => {
  const [appConfigActive, toggleAppConfigActive] = useReducer((b) => !b, false);

  const [appMenuContents, dispatchAppMenuContents] = useReducer(
    appMenuContentsReducer,
    childContent ? [childContent] : []
  );

  const handleToggleChildContent = useCallback(
    (content: { element: JSX.Element; title: string; id: string }) => {
      appMenuContents.filter((v) => v.id === content.id).length > 0
        ? dispatchAppMenuContents({
            type: "remove",
          })
        : dispatchAppMenuContents({
            type: "add",
            payload: { ...content },
          });
    },
    [appMenuContents]
  );

  const handleCloseAppConfig = useCallback(() => {
    dispatchAppMenuContents({ type: "reset" });
    toggleAppConfigActive();
  }, [toggleAppConfigActive, dispatchAppMenuContents]);

  const handleToggleAppStatesVisualizer = useCallback(() => {
    handleToggleChildContent({
      element: <AppStatesVisualizer active />,
      ...APP_CONFIG_CHILD_ITEM.STATE_VISUALIZER,
    });
  }, [handleToggleChildContent]);

  const handleTogglePdfUploader = useCallback(() => {
    handleToggleChildContent({
      element: (
        <div className="w-full h-full flex-xyc">
          <PdfUplorder />
        </div>
      ),
      ...APP_CONFIG_CHILD_ITEM.PDF_UPLOADER,
    });
  }, [handleToggleChildContent]);

  const handleToggleAssetPicker = useCallback(() => {
    handleToggleChildContent({
      element: (
        <div className="w-full h-full flex-xyc">
          <LocalAssetRegistrationForm
            handleClose={() => dispatchAppMenuContents({ type: "remove" })}
          />
        </div>
      ),
      ...APP_CONFIG_CHILD_ITEM.LOCAL_ASSET_PICKER,
    });
  }, [handleToggleChildContent]);

  if (!appConfigActive)
    return (
      <div className="fixed top-2 left-2 z-20 bg-black-transparent-01 rounded-full">
        <AppConfigActivatorButton
          handleToggleAppConfigActive={toggleAppConfigActive}
        />
      </div>
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
            App Settings
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
              <p className="py-2 text-sm text-slate-600 font-bold">
                SwapVid Demo version {APP_VERSION}
              </p>
              <div className="h-8"></div>
              <AppConfigFileHandlers
                togglePdfUploader={handleTogglePdfUploader}
                toggleAssetPicker={handleToggleAssetPicker}
              />
              <AppConfigMenuPlayerOptions />
              <AppConfigBackendServiceOptions />
              {/* <AppConfigMenuSequenceAnalyzerOptions /> */}
              {/* <AppConfigMenuSwapVidDesktopOptions /> */}
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

const AppConfigFileHandlers: React.FC<{
  togglePdfUploader: () => void;
  toggleAssetPicker: () => void;
}> = ({ togglePdfUploader, toggleAssetPicker }) => {
  return (
    <AppConfigMenuSectionContainer>
      <AppConfigLinkItem handleClick={toggleAssetPicker}>
        Open Asset Picker{" "}
        <FontAwesomeIcon icon={faCircleRight} className="text-black" />
      </AppConfigLinkItem>

      <AppConfigLinkItem handleClick={togglePdfUploader}>
        Upload PDF{" "}
        <FontAwesomeIcon icon={faCircleRight} className="text-black" />
      </AppConfigLinkItem>
    </AppConfigMenuSectionContainer>
  );
};

const AppConfigBackendServiceOptions: React.FC = () => {
  const [backendServiceHost, setBackendServiceHost] = useAtom(
    backendServiceHostAtom
  );

  const [sequenceAnalyzerSyncIntervalMs, setSequenceAnalyzerSyncIntervalMs] =
    useAtom(sequenceAnalyzerSyncIntervalMsAtom);

  return (
    <AppConfigMenuSectionContainer title="Backend Service Options">
      <AppConfigInput
        labelText="Backend Service Host"
        currentValue={backendServiceHost}
        handleSetValue={setBackendServiceHost}
      />

      <AppConfigInput
        labelText="Backend Sync Interval (ms)"
        currentValue={String(sequenceAnalyzerSyncIntervalMs)}
        handleSetValue={(v) => setSequenceAnalyzerSyncIntervalMs(Number(v))}
      />
    </AppConfigMenuSectionContainer>
  );
};

const AppConfigMenuPlayerOptions: React.FC = () => {
  const [swapVidInterfaceType, setSwapVidInterfaceType] = useAtom(
    swapvidInterfaceTypeAtom
  );
  const [videoSrc, setVideoSrc] = useAtom(videoSrcAtom);

  const [sequenceAnalyzerEnabled, setSequenceAnalyzerEnabled] = useAtom(
    sequenceAnalyzerEnabledAtom
  );
  const [swapVidDesktopEnabled, setSwapVidDesktopEnabled] = useAtom(
    swapvidDesktopEnabledAtom
  );

  const handleToggleSwapVidDesktop = () => {
    const nextValue = !swapVidDesktopEnabled;
    setSwapVidDesktopEnabled(nextValue);
    nextValue && setSequenceAnalyzerEnabled(nextValue);
  };

  const handleToggleSequenceAnalyzerEnabled = () => {
    setSequenceAnalyzerEnabled(!sequenceAnalyzerEnabled);
  };

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
        handleClick={handleToggleSequenceAnalyzerEnabled}
        disabled={swapVidDesktopEnabled}
      />

      <AppConfigToggle
        labelText="SwapVid Desktop"
        currentValue={swapVidDesktopEnabled}
        handleClick={handleToggleSwapVidDesktop}
      />

      {/* {React.createElement(AppConfigMultipleSelect<TMediaSourceType>, {
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
      } as TAppConfigMultipleSelectProps<TMediaSourceType>)} */}

      {typeof videoSrc === "string" && (
        <AppConfigInput
          labelText="Video Source URL"
          currentValue={videoSrc ?? ""}
          handleSetValue={setVideoSrc}
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
