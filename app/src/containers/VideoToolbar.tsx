import React, { useCallback } from "react";
import "@styles/VideoToolbar.scss";
import {
  VideoToolbarPanelCenter,
  VideoToolbarPanelLeft,
  VideoToolbarPanelRight,
} from "@/presentations/ToolbarPanel";
import { useAtom, useAtomValue } from "jotai/react";
import {
  documentOverviewActiveAtom,
  documentPlayerActiveAtom,
  documentPlayerStandbyAtom,
  pdfRendererStateAtom,
  pipVideoWindowActiveAtom,
  preGeneratedScrollTimelineDataAtom,
  sequenceAnalyzerEnabledAtom,
  sequenceAnalyzerStateAtom,
  subtitlesActiveAtom,
  swapvidInterfaceTypeAtom,
  videoElementRefAtom,
  videoElementStateAtom,
  videoViewportAtom,
} from "@/providers/jotai/store";

const _VideoToolbar: React.FC<{
  ambientBackgroundEnabled: boolean;
  playAndPauseButtonEnabled?: boolean;
  zIndex?: number;
}> = ({ ambientBackgroundEnabled, playAndPauseButtonEnabled, zIndex }) => {
  const videoViewport = useAtomValue(videoViewportAtom);
  const [documentPlayerActive, setDocumentPlayerActive] = useAtom(
    documentPlayerActiveAtom
  );
  const [subtitlesActive, setSubtitlesActive] = useAtom(subtitlesActiveAtom);
  const [pipVideoWindowActive, setPipVideoWindowActive] = useAtom(
    pipVideoWindowActiveAtom
  );
  const [documentOverviewActive, setDocumentOverviewActive] = useAtom(
    documentOverviewActiveAtom
  );

  const pdfRendererState = useAtomValue(pdfRendererStateAtom);
  const documentPlayerStandby = useAtomValue(documentPlayerStandbyAtom);
  const sequenceAnalyzerState = useAtomValue(sequenceAnalyzerStateAtom);
  const sequenceAnalyzerEnabled = useAtomValue(sequenceAnalyzerEnabledAtom);
  const videoElementRef = useAtomValue(videoElementRefAtom);
  const videoElementState = useAtomValue(videoElementStateAtom);
  const interfaceType = useAtomValue(swapvidInterfaceTypeAtom);
  const preGeneratedScrollTimelineData = useAtomValue(
    preGeneratedScrollTimelineDataAtom
  );

  const handlePlayAndPauseButtonClick = useCallback(() => {
    const videoElement = videoElementRef?.current;
    if (videoElement) {
      videoElement.paused ? videoElement.play() : videoElement.pause();
    }
  }, [videoElementRef]);

  const handlePiPVideoWindowButonClick = useCallback(() => {
    setPipVideoWindowActive((b) => !b);
  }, [setPipVideoWindowActive]);

  const handleDocumentOverviewButtonClick = useCallback(() => {
    setDocumentOverviewActive((b) => !b);
  }, [setDocumentOverviewActive]);

  const handlePlayerButtonClick = useCallback(() => {
    setDocumentPlayerActive((b) => !b);
  }, [setDocumentPlayerActive]);

  const handleSubtitlesButtonClick = useCallback(() => {
    setSubtitlesActive((b) => !b);
  }, [setSubtitlesActive]);

  const handleChangeVideoVolumeSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (videoElementRef?.current) {
        videoElementRef.current.volume = Number(e.currentTarget.value);
      }
    },
    [videoElementRef]
  );

  const handleToggleChangeVideoVolumeMuted = useCallback(() => {
    if (videoElementRef?.current) {
      videoElementRef.current.volume = 0;
    }
  }, [videoElementRef]);

  const pdfMatched = !!videoViewport;

  let wrapperStyleAmbientBackgroundEnabled = "document-pdf-none";
  if (pdfMatched) {
    // PDF matched.
    wrapperStyleAmbientBackgroundEnabled = documentPlayerActive
      ? "active"
      : documentPlayerStandby
      ? "standby"
      : "";
  }

  const wrapperStyle = `bg-toolbar flex justify-between py-2 ${
    ambientBackgroundEnabled ? wrapperStyleAmbientBackgroundEnabled : ""
  }`;

  const liveStreamingEnabled = videoElementRef?.current?.duration === Infinity;
  const parallelViewEnabled = interfaceType === "parallel";

  const documentAvailableOnClient = pdfRendererState.loaded;
  const documentAvailableOnSequenceAnalyzer =
    !sequenceAnalyzerEnabled || sequenceAnalyzerState.pdfAvailable;

  return (
    <div
      id="video_toolbar"
      className={`text-white select-none ${wrapperStyle}`}
      style={{
        zIndex: zIndex ?? "auto",
      }}
    >
      <VideoToolbarPanelLeft
        handleClickPlayAndPauseButton={handlePlayAndPauseButtonClick}
        handleChangeVideoVolumeSlider={handleChangeVideoVolumeSlider}
        handleToggleVideoVolumeMuted={handleToggleChangeVideoVolumeMuted}
        liveModeEnabled={liveStreamingEnabled}
        videoPaused={videoElementState.paused}
        videoVolume={videoElementState.volume}
        playAndPauseButtonEnabled={playAndPauseButtonEnabled ?? true}
      />

      {interfaceType === "combined" && (
        <VideoToolbarPanelCenter
          sequenceAnalyzerEnabled={sequenceAnalyzerEnabled}
          sequenceAnalyzerRunning={sequenceAnalyzerState.running}
          preGeneratedScrollTimelineExists={!!preGeneratedScrollTimelineData}
          documentAvailableOnClient={documentAvailableOnClient}
          documentAvailableOnSequenceAnalyzer={
            documentAvailableOnSequenceAnalyzer
          }
          documentPlayerActive={documentPlayerActive}
          documentPlayerStandby={documentPlayerStandby}
        />
      )}

      <VideoToolbarPanelRight
        subtitlesPanelEnabled
        documentPlayerActive={documentPlayerActive}
        subtitlesActive={subtitlesActive}
        pipVideoWindowActive={pipVideoWindowActive}
        documentOverviewActive={documentOverviewActive}
        hidePipVideoWindowButtonEnabled={
          liveStreamingEnabled || parallelViewEnabled
        }
        hideDocumentOverviewButtonEnabled={
          liveStreamingEnabled || parallelViewEnabled
        }
        handlePiPVideoWindowButtonClick={handlePiPVideoWindowButonClick}
        handleDocumentOverviewButtonClick={handleDocumentOverviewButtonClick}
        handlePlayerButtonClick={handlePlayerButtonClick}
        handleSubtitlesButtonClick={handleSubtitlesButtonClick}
      />
    </div>
  );
};

export const VideoToolbar = React.memo(_VideoToolbar);
