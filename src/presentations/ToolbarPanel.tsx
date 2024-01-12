import React from "react";
import { VideoToolbarCurrentTimeDisplay } from "@/containers/VideoToolbarCurrentTimeDisplay";
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

/** TODO: Refactor this component */

export const VideoToolbarPanelLeft: React.FC<{
  videoPaused: boolean;
  videoVolume: number;
  liveModeEnabled: boolean;
  playAndPauseButtonEnabled: boolean;
  handleClickPlayAndPauseButton: () => void;
  handleChangeVideoVolumeSlider: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleToggleVideoVolumeMuted: () => void;
}> = React.memo(
  ({
    videoPaused,
    liveModeEnabled,
    playAndPauseButtonEnabled,
    videoVolume,
    handleClickPlayAndPauseButton,
    handleChangeVideoVolumeSlider,
    handleToggleVideoVolumeMuted,
  }) => (
    <div className="flex justify-between">
      {playAndPauseButtonEnabled && (
        <VideoToolbarPanelTypeA
          handleButtonClick={handleClickPlayAndPauseButton}
        >
          <FontAwesomeIcon
            className="flex items-center text-2xl"
            icon={videoPaused ? faPlay : faPause}
          ></FontAwesomeIcon>
        </VideoToolbarPanelTypeA>
      )}

      <p className="flex items-center text-lg h-full select-none px-4">
        <VideoToolbarCurrentTimeDisplay liveModeEnabled={liveModeEnabled} />
      </p>

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
    </div>
  )
);

export const VideoToolbarPanelCenter: React.FC<{
  sequenceAnalyzerEnabled: boolean;
  documentAvailableOnClient: boolean;
  documentAvailableOnSequenceAnalyzer: boolean;
  documentPlayerStandby: boolean;
  documentPlayerActive: boolean;
}> = React.memo(
  ({
    documentAvailableOnClient,
    documentAvailableOnSequenceAnalyzer,
    documentPlayerStandby,
    documentPlayerActive,
  }) => {
    if (!documentAvailableOnClient) {
      return (
        <p className="flex-xyc gap-2 text-sm">
          <FontAwesomeIcon
            className="text-2xl text-yellow-400"
            icon={faCircleExclamation}
          />
          PDF is unavailable.
        </p>
      );
    }

    if (!documentAvailableOnSequenceAnalyzer) {
      return (
        <p className="flex-xyc gap-2 text-sm">
          <FontAwesomeIcon
            className="text-2xl text-yellow-400"
            icon={faCircleExclamation}
          />
          Sequence analyzer is stopped.
        </p>
      );
    }

    if (!documentPlayerStandby) {
      return null;
    }

    return documentPlayerActive ? (
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
    ) : (
      <p className="flex-xyc gap-2 text-sm">
        <span
          className="block rounded-full bg-blue-400"
          style={{
            width: 10,
            height: 10,
          }}
        ></span>
        Document standby
      </p>
    );
  }
);

export const VideoToolbarPanelRight: React.FC<{
  documentPlayerActive: boolean;
  subtitlesActive: boolean;
  pipVideoWindowActive: boolean;
  documentOverviewActive: boolean;
  subtitlesPanelEnabled: boolean;
  hidePipVideoWindowButtonEnabled?: boolean;
  hideDocumentOverviewButtonEnabled?: boolean;
  handlePiPVideoWindowButtonClick: () => void;
  handleDocumentOverviewButtonClick: () => void;
  handlePlayerButtonClick: () => void;
  handleSubtitlesButtonClick: () => void;
}> = React.memo(
  ({
    documentPlayerActive,
    subtitlesActive,
    pipVideoWindowActive,
    documentOverviewActive,
    subtitlesPanelEnabled,
    hidePipVideoWindowButtonEnabled,
    hideDocumentOverviewButtonEnabled,
    handlePiPVideoWindowButtonClick,
    handleDocumentOverviewButtonClick,
    handlePlayerButtonClick,
    handleSubtitlesButtonClick,
  }) => (
    <div className="flex justify-between gap-2">
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
                  border: documentOverviewActive
                    ? "1.5px dashed white"
                    : "none",
                }}
              ></div>
            ))}
          </div>
          <span className="font-bold text-xl">
            {documentOverviewActive ? <>&larr;</> : <>&rarr;</>}
          </span>
        </div>
      </VideoToolbarPanelTypeB>

      <VideoToolbarPanelTypeB
        disabled={!documentPlayerActive || hidePipVideoWindowButtonEnabled}
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

      <button
        className={`flex-xyc gap-[10px] p-2 rounded-md hover:bg-gray-600 w-[65px]`}
        onClick={handlePlayerButtonClick}
      >
        <FontAwesomeIcon
          className={`text-2xl`}
          icon={documentPlayerActive ? faFilm : faFileInvoice}
        />
      </button>
      {subtitlesPanelEnabled && (
        <VideoToolbarPanelTypeA handleButtonClick={handleSubtitlesButtonClick}>
          <FontAwesomeIcon
            className={`text-2xl ${
              subtitlesActive ? "opacity-1" : "opacity-40"
            }`}
            icon={faClosedCaptioning}
          />
        </VideoToolbarPanelTypeA>
      )}
    </div>
  )
);

export const PoCUserStudyVideoToolbarPanelCenter: React.FC<{
  documentPlayerActive: boolean;
  handlePlayerButtonClick?: (v: boolean) => void;
}> = ({ documentPlayerActive, handlePlayerButtonClick }) => (
  <ul className="flex-xyc">
    {documentPlayerActive ? (
      <button
        className={`flex px-16 py-[5px] items-center gap-4 rounded-md bg-red-600 hover:text-red-600 hover:bg-white`}
        onClick={() => {
          handlePlayerButtonClick && handlePlayerButtonClick(false);
        }}
      >
        <FontAwesomeIcon className="text-3xl" icon={faFileInvoice} />
        <span className="text-lg">Back to video player</span>
      </button>
    ) : (
      <button
        className={`flex px-16 py-[5px] items-center gap-4 rounded-md bg-blue-600 hover:text-blue-600 hover:bg-white`}
        onClick={() => {
          handlePlayerButtonClick && handlePlayerButtonClick(true);
        }}
      >
        <FontAwesomeIcon className="text-3xl" icon={faFileInvoice} />
        <span className="text-lg">Open document viewer</span>
      </button>
    )}
  </ul>
);

export const PoCUserStudyVideoToolbarPanelRight: React.FC<{
  documentPlayerActive: boolean;
  videoSubtitlesActive: boolean;
  hideSubtitlePanel?: boolean;
  handlePlayerButtonClick?: () => void;
  handleSubtitlesButtonClick?: () => void;
}> = ({
  videoSubtitlesActive,
  hideSubtitlePanel,
  handleSubtitlesButtonClick,
}) => (
  <ul className={`flex justify-between gap-2`}>
    {!hideSubtitlePanel && (
      <VideoToolbarPanelTypeA handleButtonClick={handleSubtitlesButtonClick}>
        <FontAwesomeIcon
          className={`text-2xl ${
            videoSubtitlesActive ? "opacity-1" : "opacity-40"
          }`}
          icon={faClosedCaptioning}
        />
      </VideoToolbarPanelTypeA>
    )}
  </ul>
);
