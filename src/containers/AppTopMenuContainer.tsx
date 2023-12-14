import React, { PropsWithChildren, useCallback, useState } from "react";
import { TAssetId, TInterfaceMode } from "@/types/swapvid";
import { ASSET_ID_LIST } from "@/app.config";

export const AppTopMenuContainer = (
  props: PropsWithChildren<{
    activeAssetId: TAssetId;
    handleChangeActiveAssetId: (assetId: TAssetId) => void;
    handleChangeInterfaceMode: (mode: TInterfaceMode) => void;

    hideCombinedLiveViewButton?: boolean;
    hideCombinedLocalViewButton?: boolean;
    hideParallelLocalViewButton?: boolean;
  }>
) => {
  const [appTopMenuVisible, setAppTopMenuVisible] = useState(false);
  const [assetChangeFormVisible, setAssetChangeFormVisible] = useState(false);

  const showAppTopMenu = useCallback(() => {
    setAppTopMenuVisible(true);
  }, [setAppTopMenuVisible]);
  const hideAppTopMenu = useCallback(() => {
    setAppTopMenuVisible(false);
  }, [setAppTopMenuVisible]);

  const handleChangeAssetSelectFormActive = useCallback(
    (value?: boolean) => {
      setAssetChangeFormVisible((b) => (value !== undefined ? value : !b));
    },
    [setAssetChangeFormVisible]
  );

  const handleClickInterfaceModeToCombinedLSBtn = useCallback(
    () => props.handleChangeInterfaceMode("combined-ls"),
    [props]
  );

  const handleClickInterfaceModeToCombinedBtn = useCallback(
    () => props.handleChangeInterfaceMode("combined"),
    [props]
  );

  const handleClickInterfaceModeToParallelBtn = useCallback(
    () => props.handleChangeInterfaceMode("parallel"),
    [props]
  );

  return (
    <>
      {appTopMenuVisible ? (
        <div className="absolute top-0 left-0 flex-xyc gap-4 text-center text-white text-md p-2">
          <h1 className="flex-xyc gap-4 bg-neutral-800 text-center text-white">
            <p className="flex-xyc gap-2">
              Playing: <b>{props.activeAssetId}</b>
            </p>
            <button
              className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
              onClick={() => {
                handleChangeAssetSelectFormActive();
              }}
            >
              Change Asset
            </button>
            {!props.hideCombinedLiveViewButton && (
              <button
                className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
                onClick={handleClickInterfaceModeToCombinedLSBtn}
              >
                SwapVid (Live)
              </button>
            )}
            {!props.hideCombinedLocalViewButton && (
              <button
                className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
                onClick={handleClickInterfaceModeToCombinedBtn}
              >
                SwapVid (Local)
              </button>
            )}
            {!props.hideParallelLocalViewButton && (
              <button
                className={"p-2 rounded-md font-bold bg-slate-600"}
                onClick={handleClickInterfaceModeToParallelBtn}
              >
                Side-by-side (Local)
              </button>
            )}
            <button
              className={"p-2 rounded-md font-bold bg-red-700"}
              onClick={hideAppTopMenu}
            >
              Close App Menu
            </button>
            {/* <button
                    className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
                    onClick={handleFullScreen}
                  >
                    {isFullScreen ? "Exit full screen" : "Request full screen"}
                </button> */}
          </h1>
        </div>
      ) : (
        <button
          className="fixed top-0 left-0 flex-xyc w-full h-[50px] p-2 font-bold text-white text-xl bg-black-transparent-01 opacity-0 hover:opacity-100"
          onClick={showAppTopMenu}
        >
          Show App Menu
        </button>
      )}

      {assetChangeFormVisible && (
        <div
          className="fixed z-90 top-0 left-0 w-full h-full bg-black-transparent-01 flex-xyc z-10"
          onClick={() => handleChangeAssetSelectFormActive()}
        >
          <div
            className="bg-gray-200 rounded-md p-[50px] font-bold text-xl text-center text-black"
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
                    props.activeAssetId === v
                      ? "bg-gray-400 text-white pointer-events-none"
                      : "hover:bg-slate-600 hover:text-white"
                  }
                      `}
                  onClick={() => {
                    props.handleChangeActiveAssetId(v as TAssetId);
                  }}
                >
                  {v}
                  {props.activeAssetId === v && " (playing)"}
                </button>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
