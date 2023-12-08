import { TAssetId, TInterfaceMode } from "@/@types/types";
import { ASSET_ID_LIST } from "@/app.config";
import React, { PropsWithChildren, useCallback, useState } from "react";

export const AppTopMenuContainer = (
  props: PropsWithChildren<{
    activeAssetId: TAssetId;
    handleChangeActiveAssetId: (assetId: TAssetId) => void;
    handleChangeInterfaceMode: (mode: TInterfaceMode) => void;
  }>
) => {
  const [assetChangeFormVisible, setAssetChangeFormVisible] = useState(false);

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

  // const handleClickInterfaceModeToParallelLsBtn = useCallback(
  //   () => props.handleChangeInterfaceMode("parallel"),
  //   [props]
  // );

  return (
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
        <button
          className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
          onClick={handleClickInterfaceModeToCombinedLSBtn}
        >
          Use cb-LS
        </button>
        <button
          className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
          onClick={handleClickInterfaceModeToCombinedBtn}
        >
          Use cb-OD
        </button>
        {/* <button
                    className="p-2 rounded-md font-bold bg-slate-600 hover:bg-slate-500"
                    onClick={handleFullScreen}
                  >
                    {isFullScreen ? "Exit full screen" : "Request full screen"}
                  </button> */}
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

      {assetChangeFormVisible && (
        <div
          className="fixed z-90 top-0 left-0 w-full h-full bg-black-transparent-01 flex-xyc"
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
    </div>
  );
};
