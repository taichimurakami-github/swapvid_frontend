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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function VideoToolbar(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    videoElementPaused: boolean;
    videoElementMuted: boolean;
    videoSubtitlesActive: boolean;
    documentPlayerActive: boolean;
    documentPlayerStandby: boolean;

    onHandleMuteButtonClick: (nextMuted: boolean) => void;
    // onHandlePlayAndPauseButtonClick: (nextPaused: boolean) => void;

    onDocumentPlayerButtonClick: (v: boolean) => void;
    onSubtitlesButtonClick: (v: boolean) => void;

    /** control panel disable settings */
    disableControlPanelMuted?: boolean;
    disableControlPanelPauseAndPlay?: boolean;
    disableControlPanelSubtitle?: boolean;
  }>
) {
  return (
    <ul className="video-tools-wrapper text-white select-none">
      <div
        className={`flex justify-between h-[60px] ${
          props.documentPlayerActive ? "bg-red-900" : "bg-black"
        }`}
      >
        <ul className="flex justify-between">
          {!props.disableControlPanelPauseAndPlay && (
            <li
              id={UIELEM_ID_LIST.system.videoPlayer.pauseAndPlayButton}
              className={`flex-xyc cursor-pointer rounded-md w-[65px] hover:bg-gray-600`}
              onClick={() => {
                props.videoElement.click();
              }}
            >
              <FontAwesomeIcon
                className="flex items-center text-2xl"
                icon={props.videoElement.paused ? faPlay : faPause}
              ></FontAwesomeIcon>
            </li>
          )}

          <li className="flex items-center text-lg h-full select-none px-4">
            <VideoToolbarCurrenttimeContainer
              videoElement={props.videoElement}
              enableLiveMode={false}
            />
          </li>

          {!props.disableControlPanelMuted && (
            <li
              id={UIELEM_ID_LIST.system.videoPlayer.muteButton}
              className="flex items-center cursor-pointer h-full"
              onClick={() => {
                props.onHandleMuteButtonClick(!props.videoElementMuted);
              }}
            >
              <FontAwesomeIcon
                className="text-white text-xl"
                icon={props.videoElementMuted ? faVolumeMute : faVolumeUp}
              ></FontAwesomeIcon>
            </li>
          )}
        </ul>
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
        <ul className={`flex justify-between gap-6`}>
          <li
            id={UIELEM_ID_LIST.system.documentPlayer.enableDocumentPlayerButton}
            className={`flex-xyc gap-[10px] cursor-pointer p-2 rounded-md hover:bg-gray-600`}
            onClick={() => {
              props.onDocumentPlayerButtonClick(!props.documentPlayerActive);
            }}
          >
            <FontAwesomeIcon className={`text-3xl`} icon={faFileInvoice} />
            <p className="text-xl">
              Click to {!props.documentPlayerActive ? "Show" : "Close"} Document
            </p>
          </li>
          {!props.disableControlPanelSubtitle && (
            <li
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
            </li>
          )}
        </ul>
      </div>
    </ul>
  );
}
