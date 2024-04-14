import React from "react";
import {
  VideoToolbarPanelTypeA,
  VideoToolbarPanelTypeB,
} from "@/presentations/Button";
import { getRangeArray } from "@/utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faClosedCaptioning,
  faFileInvoice,
  faFilm,
  faCircleExclamation,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { AppProgressBar } from "./BackendApi";

const SOURCE_TYPE = {
  SEQUENCE_ANALYZER: "Sequence Analyzer",
  PRE_GENERATED_TIMELINE: "Pre-generated timeline",
};

export const VideoPlayAndPauseButton: React.FC<{
  videoPaused: boolean;
  handleClickPlayAndPauseButton: () => void;
}> = ({ handleClickPlayAndPauseButton, videoPaused }) => (
  <VideoToolbarPanelTypeA handleButtonClick={handleClickPlayAndPauseButton}>
    <FontAwesomeIcon
      className="flex items-center text-2xl"
      icon={videoPaused ? faPlay : faPause}
    ></FontAwesomeIcon>
  </VideoToolbarPanelTypeA>
);

export const VideoVolumeSlider: React.FC<{
  videoVolume: number;
  handleChangeVideoVolumeSlider: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleToggleVideoVolumeMuted: () => void;
}> = ({
  videoVolume,
  handleChangeVideoVolumeSlider,
  handleToggleVideoVolumeMuted,
}) => (
  <div className="flex-xyc gap-2">
    <FontAwesomeIcon
      className="flex items-center text-xl w-[1.5rem]"
      icon={videoVolume > 0 ? faVolumeUp : faVolumeMute}
      onClick={handleToggleVideoVolumeMuted}
    ></FontAwesomeIcon>

    <input
      type="range"
      className="w-[75px]"
      min={0}
      max={1}
      step={0.02}
      value={videoVolume}
      onChange={handleChangeVideoVolumeSlider}
    />
  </div>
);

/**
 * Video Toolbar Center Panel Components
 */

export const NotificationPdfUnavailableOnClient: React.FC = () => (
  <p className="flex-xyc gap-2 text-sm">
    <FontAwesomeIcon
      className="text-2xl text-yellow-400"
      icon={faCircleExclamation}
    />
    PDF is unavailable.
  </p>
);

export const NotificationPdfUnavailableOnServer: React.FC = () => (
  <div className="flex-xyc flex-col">
    <p className="flex-xyc gap-2 text-sm">
      <FontAwesomeIcon
        className="text-2xl text-yellow-400"
        icon={faCircleExclamation}
      />
      Please upload PDF file.
    </p>
    <p className="text-[11px]">(Source: {SOURCE_TYPE.SEQUENCE_ANALYZER})</p>
  </div>
);

export const NotificationPreGeneratedTimelineUnavailable: React.FC = () => (
  <div className="text-center">
    <p className="flex-xyc gap-2 text-sm">
      <FontAwesomeIcon
        className="text-2xl text-yellow-400"
        icon={faCircleExclamation}
      />
      Please select scroll timeline data.
    </p>
    <p className="text-[11px]">
      (Source: {SOURCE_TYPE.PRE_GENERATED_TIMELINE})
    </p>
  </div>
);

export const NotificationSequenceAnalyzerStopped: React.FC = () => (
  <div className="text-center">
    <p className="flex-xyc gap-2 text-sm">
      <FontAwesomeIcon
        className="text-2xl text-yellow-400"
        icon={faCircleExclamation}
      />
      Sequence analyzer is stopped.
    </p>
    <p className="text-[11px]">(Source: {SOURCE_TYPE.SEQUENCE_ANALYZER})</p>
  </div>
);

export const NotificationAnalyzingPdfOnServer: React.FC<{
  progress: number;
}> = ({ progress }) => (
  <div className="grid gap-1">
    <p className="text-center">Generating document index. Please wait...</p>
    <AppProgressBar heightPx={8} progressPct={progress} />
  </div>
);

export const NotificationDocumentPlayerActive: React.FC = () => (
  <p className="flex-xyc gap-2 text-sm">
    <span
      className="block rounded-full bg-red-500 border-1 border-white"
      style={{
        width: 10,
        height: 10,
      }}
    ></span>
    Document active
  </p>
);

export const NotificationDocumentPlayerStandby: React.FC<{
  sequenceAnalyzerEnabled: boolean;
}> = ({ sequenceAnalyzerEnabled }) => (
  <div className="grid text-sm">
    <p className="flex-xyc gap-2">
      <span
        className="block rounded-full bg-blue-400"
        style={{
          width: 10,
          height: 10,
        }}
      ></span>
      Document standby
    </p>
    <p className="text-[11px]">
      (
      {sequenceAnalyzerEnabled
        ? "Source: Sequence Analyzer"
        : "Source: Pre-generated timeline"}
      )
    </p>
  </div>
);

/**
 * Video Toolbar Right Panel Components
 */

export const DocumentOverviewSwitch: React.FC<{
  documentPlayerActive: boolean;
  documentOverviewActive: boolean;
  hideDocumentOverviewButtonEnabled: boolean;
  handleDocumentOverviewButtonClick: () => void;
}> = ({
  documentPlayerActive,
  documentOverviewActive,
  hideDocumentOverviewButtonEnabled,
  handleDocumentOverviewButtonClick,
}) => (
  <VideoToolbarPanelTypeB
    disabled={!documentPlayerActive || hideDocumentOverviewButtonEnabled}
    handleButtonClick={handleDocumentOverviewButtonClick}
  >
    <div className="absolute rounded-sm w-[35px] h-[28px] bg-white opacity-40"></div>

    <div className="absolute px-2 py-1 flex-xyc gap-1 w-full rounded-sm">
      <div className="grid gap-[2px]">
        {getRangeArray(3).map((v) => (
          <div
            className="w-[0.95rem] h-[0.65rem] rounded-sm bg-white"
            key={v}
            style={{
              // opacity: documentOverviewActive ? 0.5 : 0.4,
              background: documentOverviewActive ? "none" : "white",
              border: documentOverviewActive ? "1.5px dashed white" : "none",
            }}
          ></div>
        ))}
      </div>
      <span className="font-bold text-xl">
        {documentOverviewActive ? <>&larr;</> : <>&rarr;</>}
      </span>
    </div>
  </VideoToolbarPanelTypeB>
);

export const PipVideoWindowSwitch: React.FC<{
  documentPlayerActive: boolean;
  pipVideoWindowActive: boolean;
  handlePiPVideoWindowButtonClick: () => void;
}> = ({
  documentPlayerActive,
  pipVideoWindowActive,
  handlePiPVideoWindowButtonClick,
}) => (
  <VideoToolbarPanelTypeB
    disabled={!documentPlayerActive}
    handleButtonClick={handlePiPVideoWindowButtonClick}
  >
    <div
      className="rounded-sm w-[35px] h-[28px] bg-white"
      style={{
        opacity: pipVideoWindowActive ? 0.5 : 0.4,
      }}
    ></div>

    <div
      className="absolute flex-xyc right-0 bottom-0 -translate-x-[10px] -translate-y-[5px] rounded-sm w-[30px] h-[25px]"
      style={{
        background: pipVideoWindowActive ? "none" : "white",
        border: pipVideoWindowActive ? "2.5px dashed white" : "none",
      }}
    >
      <div className="relative rounded-full w-[18px] h-[18px] text-red-700">
        <FontAwesomeIcon
          className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[48%]"
          icon={faPlay}
        ></FontAwesomeIcon>
      </div>
    </div>
  </VideoToolbarPanelTypeB>
);

export const PlayerSwitch: React.FC<{
  documentPlayerActive: boolean;
  handlePlayerButtonClick: () => void;
}> = ({ documentPlayerActive, handlePlayerButtonClick }) => (
  <button
    className={`flex-xyc gap-[10px] p-2 rounded-md hover:bg-gray-600 w-[65px]`}
    onClick={handlePlayerButtonClick}
  >
    <FontAwesomeIcon
      className={`text-2xl`}
      icon={documentPlayerActive ? faFilm : faFileInvoice}
    />
  </button>
);

export const SubtitlesSwitch: React.FC<{
  subtitlesActive: boolean;
  handleSubtitlesButtonClick: () => void;
}> = ({ subtitlesActive, handleSubtitlesButtonClick }) => (
  <VideoToolbarPanelTypeA handleButtonClick={handleSubtitlesButtonClick}>
    <FontAwesomeIcon
      className={`text-2xl ${subtitlesActive ? "opacity-1" : "opacity-40"}`}
      icon={faClosedCaptioning}
    />
  </VideoToolbarPanelTypeA>
);
