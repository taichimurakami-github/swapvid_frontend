import React, { PropsWithChildren } from "react";
import VideoToolbarCurrenttimeContainer from "@/containers/VideoToolbarCurrentTimeContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faClosedCaptioning,
  faFileInvoice,
  faFilm,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import { UIELEM_ID_LIST } from "@/app.config";
import "@/styles/VideoToolbar.scss";

interface VideoToolbarProps {
  videoElement: HTMLVideoElement;
  videoElementPaused: boolean;
  videoElementMuted: boolean;
  videoSubtitlesActive: boolean;
  documentAvailable: boolean;
  documentPlayerActive: boolean;
  documentPlayerStandby: boolean;
  documentOverviewActive: boolean;
  draggableVideoActive: boolean;

  /** Handlers for panel click */
  // 1.Common
  onHandleMuteButtonClick: (nextMuted: boolean) => void;
  onSubtitlesButtonClick: (v: boolean) => void;
  onHandlePlayAndPauseButtonClick?: (nextPaused: boolean) => void;
  onDocumentPlayerButtonClick?: (v: boolean) => void;

  // 2.Combined only
  onHandleDocumentOverviewButtonClick?: () => void;
  onDraggableVideoButtonClick?: () => void;

  /** control panel disable settings */
  hideMutedPanel?: boolean;
  hidePauseAndPlayPanel?: boolean;
  hideSubtitlePanel?: boolean;
  hideDocumentViewerButton?: boolean;
  enablePoCUserStudyInteractiveMode?: boolean;
  enablePoCUserStudyBaselineMode?: boolean;
  disableAmbientBackground?: boolean;

  /** UI setting */
  zIndex?: number;
}

export const VideoToolbar = (props: PropsWithChildren<VideoToolbarProps>) => (
  <ul
    className="video-tools-wrapper text-white select-none"
    style={{
      zIndex: props.zIndex,
    }}
  >
    {!props.enablePoCUserStudyInteractiveMode &&
    !props.enablePoCUserStudyBaselineMode ? (
      <div
        className={`bg-toolbar flex justify-between h-[60px] py-2 ${
          !props.documentAvailable
            ? "document-pdf-none"
            : props.documentPlayerActive
            ? "active"
            : props.documentPlayerStandby
            ? "standby"
            : ""
        }`}
      >
        <SwapVidVideoToolbarPanelLeft
          hidePauseAndPlayPanel={props.hidePauseAndPlayPanel}
          videoElement={props.videoElement}
        />

        <SwapVidVideoToolbarPanelCenter
          documentAvailable={props.documentAvailable}
          documentPlayerActive={props.documentPlayerActive}
          documentPlayerStandby={props.documentPlayerStandby}
        />

        <SwapVidVideoToolbarPanelRight
          documentPlayerActive={props.documentPlayerActive}
          videoSubtitlesActive={props.videoSubtitlesActive}
          hideSubtitlePanel={props.hideSubtitlePanel}
          draggableVideoActive={props.draggableVideoActive}
          documentOverviewActive={props.documentOverviewActive}
          onDraggableVideoButtonClick={props.onDraggableVideoButtonClick}
          onHandleDocumentOverviewButtonClick={
            props.onHandleDocumentOverviewButtonClick
          }
          onDocumentPlayerButtonClick={props.onDocumentPlayerButtonClick}
          onSubtitlesButtonClick={props.onSubtitlesButtonClick}
        />
      </div>
    ) : (
      <div
        className={`bg-toolbar flex justify-between h-[60px] py-2 ${
          props.disableAmbientBackground
            ? ""
            : props.documentPlayerActive
            ? "active"
            : props.documentPlayerStandby
            ? "standby"
            : ""
        }`}
      >
        {/* use the same component as SwapVid */}
        <SwapVidVideoToolbarPanelLeft
          hidePauseAndPlayPanel={props.hidePauseAndPlayPanel}
          videoElement={props.videoElement}
        />
        {props.enablePoCUserStudyInteractiveMode && (
          <PoCUserStudyVideoToolbarPanelCenter
            documentAvailable={props.documentAvailable}
            documentPlayerActive={props.documentPlayerActive}
            documentPlayerStandby={props.documentPlayerStandby}
            onDocumentPlayerButtonClick={props.onDocumentPlayerButtonClick}
          />
        )}
        <PoCUserStudyVideoToolbarPanelRight
          documentPlayerActive={props.documentPlayerActive}
          videoSubtitlesActive={props.videoSubtitlesActive}
          hideSubtitlePanel={props.hideSubtitlePanel}
          onDocumentPlayerButtonClick={props.onDocumentPlayerButtonClick}
          onSubtitlesButtonClick={props.onSubtitlesButtonClick}
        />
      </div>
    )}
  </ul>
);

const SwapVidVideoToolbarPanelLeft = (
  props: PropsWithChildren<{
    hidePauseAndPlayPanel?: VideoToolbarProps["hidePauseAndPlayPanel"];
    videoElement: VideoToolbarProps["videoElement"];
  }>
) => (
  <ul className="flex justify-between">
    {!props.hidePauseAndPlayPanel && (
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
  </ul>
);

const SwapVidVideoToolbarPanelCenter = (
  props: PropsWithChildren<{
    documentAvailable: VideoToolbarProps["documentAvailable"];
    documentPlayerStandby: VideoToolbarProps["documentPlayerStandby"];
    documentPlayerActive: VideoToolbarProps["documentPlayerActive"];
  }>
) =>
  props.documentAvailable ? (
    <div className="flex-xyc text-sm">
      {props.documentPlayerStandby && !props.documentPlayerActive && (
        <div className="flex-xyc gap-2">
          <span
            className="block rounded-full bg-blue-400"
            style={{
              width: 10,
              height: 10,
            }}
          ></span>
          document standby
        </div>
      )}

      {props.documentPlayerActive && (
        <div className="flex-xyc gap-2">
          <span
            className="block rounded-full bg-red-500 border-1 border-white"
            style={{
              width: 10,
              height: 10,
            }}
          ></span>
          document active
        </div>
      )}
    </div>
  ) : (
    <button className="flex-xyc gap-2 text-sm">
      <FontAwesomeIcon
        className="text-2xl text-yellow-400"
        icon={faCircleExclamation}
      />
      No document PDF.
    </button>
  );

const SwapVidVideoToolbarPanelRight = (
  props: PropsWithChildren<{
    documentPlayerActive: VideoToolbarProps["documentPlayerActive"];
    videoSubtitlesActive: VideoToolbarProps["videoSubtitlesActive"];
    draggableVideoActive: VideoToolbarProps["draggableVideoActive"];
    documentOverviewActive: VideoToolbarProps["documentOverviewActive"];
    hideSubtitlePanel: VideoToolbarProps["hideSubtitlePanel"];
    onDraggableVideoButtonClick: VideoToolbarProps["onDraggableVideoButtonClick"];
    onHandleDocumentOverviewButtonClick: VideoToolbarProps["onHandleDocumentOverviewButtonClick"];
    onDocumentPlayerButtonClick: VideoToolbarProps["onDocumentPlayerButtonClick"];
    onSubtitlesButtonClick: VideoToolbarProps["onSubtitlesButtonClick"];
  }>
) => (
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
        onClick={props.onHandleDocumentOverviewButtonClick}
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
        props.onDocumentPlayerButtonClick &&
          props.onDocumentPlayerButtonClick(!props.documentPlayerActive);
      }}
    >
      <FontAwesomeIcon
        className={`text-2xl`}
        icon={props.documentPlayerActive ? faFilm : faFileInvoice}
      />
    </button>
    {!props.hideSubtitlePanel && (
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
);

const PoCUserStudyVideoToolbarPanelCenter = (
  props: PropsWithChildren<{
    documentAvailable: VideoToolbarProps["documentAvailable"];
    documentPlayerStandby: VideoToolbarProps["documentPlayerStandby"];
    documentPlayerActive: VideoToolbarProps["documentPlayerActive"];
    onDocumentPlayerButtonClick: VideoToolbarProps["onDocumentPlayerButtonClick"];
  }>
) => (
  <ul className="flex-xyc">
    {props.documentPlayerActive ? (
      <li
        id={UIELEM_ID_LIST.system.documentPlayer.disableDocumentPlayerButton}
        className={`flex px-16 py-[5px] items-center cursor-pointer gap-4 rounded-md bg-red-600 hover:text-red-600 hover:bg-white`}
        onClick={() => {
          props.onDocumentPlayerButtonClick &&
            props.onDocumentPlayerButtonClick(false);
        }}
      >
        <FontAwesomeIcon className="text-3xl" icon={faFileInvoice} />
        <span className="text-lg">Back to video player</span>
      </li>
    ) : (
      <li
        id={UIELEM_ID_LIST.system.documentPlayer.enableDocumentPlayerButton}
        className={`flex px-16 py-[5px] items-center cursor-pointer gap-4 rounded-md bg-blue-600 hover:text-blue-600 hover:bg-white`}
        onClick={() => {
          props.onDocumentPlayerButtonClick &&
            props.onDocumentPlayerButtonClick(true);
        }}
      >
        <FontAwesomeIcon className="text-3xl" icon={faFileInvoice} />
        <span className="text-lg">Open document viewer</span>
      </li>
    )}
  </ul>
);

const PoCUserStudyVideoToolbarPanelRight = (
  props: PropsWithChildren<{
    documentPlayerActive: VideoToolbarProps["documentPlayerActive"];
    videoSubtitlesActive: VideoToolbarProps["videoSubtitlesActive"];
    hideSubtitlePanel?: VideoToolbarProps["hideSubtitlePanel"];
    onDocumentPlayerButtonClick: VideoToolbarProps["onDocumentPlayerButtonClick"];
    onSubtitlesButtonClick: VideoToolbarProps["onSubtitlesButtonClick"];
  }>
) => (
  <ul className={`flex justify-between gap-2`}>
    {!props.hideSubtitlePanel && (
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
);

export default VideoToolbar;
