import React, { PropsWithChildren } from "react";
import { UIELEM_ID_LIST } from "@/app.config";
import VideoToolbarCurrenttimeContainer from "@/containers/VideoToolbarCurrentTimeContainer";
import {
  faPause,
  faPlay,
  faVolumeMute,
  faVolumeUp,
  faClosedCaptioning,
  faFileInvoice,
  faFilm,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/styles/VideoToolbar.scss";

export default function VideoToolbar(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    videoElementPaused: boolean;
    videoElementMuted: boolean;
    videoSubtitlesActive: boolean;
    documentPlayerActive: boolean;
    documentPlayerStandby: boolean;
    documentOverviewActive: boolean;
    draggableVideoActive: boolean;
    zIndex?: number;

    onHandleMuteButtonClick: (nextMuted: boolean) => void;
    // onHandlePlayAndPauseButtonClick: (nextPaused: boolean) => void;
    onHandleDocumentOverviewButtonClick: () => void;

    onDocumentPlayerButtonClick: (v: boolean) => void;
    onSubtitlesButtonClick: (v: boolean) => void;

    onDraggableVideoButtonClick: () => void;

    /** control panel disable settings */
    disableControlPanelMuted?: boolean;
    disableControlPanelPauseAndPlay?: boolean;
    disableControlPanelSubtitle?: boolean;
  }>
) {
  return (
    <ul
      className="video-tools-wrapper text-white select-none"
      style={{
        zIndex: props.zIndex,
      }}
    >
      <div
        className={`bg-toolbar flex justify-between h-[60px] py-2 ${
          props.documentPlayerActive
            ? "active"
            : props.documentPlayerStandby
            ? "standby"
            : ""
        }`}
      >
        <ul className="flex justify-between">
          {!props.disableControlPanelPauseAndPlay && (
            <button
              id={UIELEM_ID_LIST.system.videoPlayer.pauseAndPlayButton}
              className={`flex-xyc cursor-pointer rounded-md w-[65px] hover:bg-gray-600`}
              onClick={() => {
                props.videoElement.click();
              }}
            >
              <FontAwesomeIcon
                className="flex items-center text-2xl"
                icon={props.videoElement.paused ? faPlay : faPause}
                // icon={faPause}
              ></FontAwesomeIcon>
            </button>
          )}

          <li className="flex items-center text-lg h-full select-none px-4">
            <VideoToolbarCurrenttimeContainer
              videoElement={props.videoElement}
              enableLiveMode={props.videoElement.duration === Infinity}
            />
          </li>

          {!props.disableControlPanelMuted && (
            <button
              id={UIELEM_ID_LIST.system.videoPlayer.muteButton}
              className="flex-xyc cursor-pointer h-full rounded-md hover:bg-gray-600 w-[50px]"
              onClick={() => {
                props.onHandleMuteButtonClick(!props.videoElementMuted);
              }}
            >
              <FontAwesomeIcon
                className="text-white text-xl"
                icon={props.videoElementMuted ? faVolumeMute : faVolumeUp}
              ></FontAwesomeIcon>
            </button>
          )}
        </ul>

        <button className="flex-xyc gap-2 text-sm">
          {props.documentPlayerStandby && !props.documentPlayerActive && (
            <>
              <div
                className="rounded-full bg-blue-400"
                style={{
                  width: 10,
                  height: 10,
                }}
              ></div>
              document available
            </>
          )}
          {props.documentPlayerActive && (
            <>
              <div
                className="rounded-full bg-red-500 border-1 border-white"
                style={{
                  width: 10,
                  height: 10,
                }}
              ></div>
              document active
            </>
          )}
        </button>

        {/* <ul className="flex-xyc">
          {props.documentPlayerActive && (
            <li
              id={
                UIELEM_ID_LIST.system.documentPlayer.disableDocumentPlayerButton
              }
              className={`flex px-16 py-[5px] items-center cursor-pointer gap-4 rounded-md bg-red-600 hover:text-red-600 hover:bg-white`}
              onClick={() => {
                props.onDocumentPlayerButtonClick(false);
              }}
            >
              <FontAwesomeIcon className="text-3xl" icon={faFileInvoice} />
              <span className="text-lg">
                ドキュメント操作中（ここをクリックで閉じる）
              </span>
            </li>
          )}

          {props.documentPlayerStandby && !props.documentPlayerActive && (
            <li
              id={
                UIELEM_ID_LIST.system.documentPlayer.enableDocumentPlayerButton
              }
              className={`flex px-16 py-[5px] items-center cursor-pointer gap-4 rounded-md bg-blue-600 hover:text-blue-600 hover:bg-white`}
              onClick={() => {
                props.onDocumentPlayerButtonClick(true);
              }}
            >
              <FontAwesomeIcon className="text-3xl" icon={faFileInvoice} />
              <span className="text-lg">
                動画内のドキュメントが操作可能です！
              </span>
            </li>
          )}
        </ul> */}
        <ul className={`flex justify-between gap-2`}>
          {props.documentPlayerActive && (
            <button
              className={`relative p-2 flex-xyc rounded-md w-[65px] hover:bg-gray-600`}
              onClick={props.onDraggableVideoButtonClick}
            >
              <div className="rounded-sm w-[35px] h-[25px] bg-white opacity-40"></div>
              <div className="absolute flex-xyc right-3 bottom-2 rounded-sm w-[25px] h-[20px] bg-white">
                <div className="flex-xyc rounded-full w-[15px] h-[15px]  bg-red-700">
                  <FontAwesomeIcon
                    className="flex items-center w-1/2"
                    icon={faPlay}
                    // icon={faPause}
                  ></FontAwesomeIcon>
                </div>
              </div>
              {props.draggableVideoActive && (
                <div className="absolute w-full h-[5px] bg-red-900 rotate-45"></div>
              )}
            </button>
          )}

          {props.documentPlayerActive && (
            <button
              className={`relative p-2 flex-xyc rounded-md w-[65px] hover:bg-gray-600`}
              onClick={() => {
                props.onHandleDocumentOverviewButtonClick();
              }}
            >
              {props.documentOverviewActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-1/2 w-[3rem] h-[4px] bg-red-800 rotate-[-65deg]"></div>
              )}

              <div className="px-2 py-1 flex-xyc gap-1 w-full rounded-sm">
                <div className="grid gap-[3.5px]">
                  <div className="w-[1rem] h-[0.6rem] rounded-sm bg-white"></div>
                  <div className="w-[1rem] h-[0.6rem] rounded-sm bg-white"></div>
                  <div className="w-[1rem] h-[0.6rem] rounded-sm bg-white"></div>
                </div>
                <span className="font-bold text-xl">
                  {props.documentOverviewActive ? <>&larr;</> : <>&rarr;</>}
                </span>
              </div>
            </button>
          )}

          <button
            id={UIELEM_ID_LIST.system.documentPlayer.enableDocumentPlayerButton}
            className={`flex-xyc gap-[10px] cursor-pointer p-2 rounded-md hover:bg-gray-600 w-[65px]`}
            onClick={() => {
              props.onDocumentPlayerButtonClick(!props.documentPlayerActive);
            }}
          >
            <FontAwesomeIcon
              className={`text-2xl`}
              icon={props.documentPlayerActive ? faFilm : faFileInvoice}
            />
            {/* <p className="text-md">
              Click to {!props.documentPlayerActive ? "Open" : "Close"}
            </p> */}
          </button>
          {!props.disableControlPanelSubtitle && (
            <button
              id={UIELEM_ID_LIST.system.videoPlayer.captionButton}
              className={`flex-xyc cursor-pointer rounded-md w-[65px] hover:bg-gray-600`}
              onClick={() => {
                props.onSubtitlesButtonClick(!props.videoSubtitlesActive);
              }}
            >
              <FontAwesomeIcon
                className={`text-2xl ${
                  props.videoSubtitlesActive ? "opacity-1" : "opacity-40"
                }`}
                icon={faClosedCaptioning}
              />
            </button>
          )}
        </ul>
      </div>
    </ul>
  );
}
