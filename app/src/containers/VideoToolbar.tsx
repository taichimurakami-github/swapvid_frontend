import React, { useCallback, useMemo } from "react";
import "@styles/VideoToolbar.scss";
import {
  DocumentOverviewSwitch,
  NotificationAnalyzingPdfOnServer,
  NotificationDocumentPlayerActive,
  NotificationDocumentPlayerStandby,
  NotificationPdfUnavailableOnClient,
  NotificationPdfUnavailableOnServer,
  NotificationPreGeneratedTimelineUnavailable,
  NotificationSequenceAnalyzerStopped,
  PipVideoWindowSwitch,
  PlayerSwitch,
  SubtitlesSwitch,
  VideoPlayAndPauseButton,
  VideoVolumeSlider,
} from "@/presentations/ToolbarPanel";
import { useAtom, useAtomValue } from "jotai/react";
import {
  backendPdfAnalyzerApiStateAtom,
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
import { VideoCurrentTimeDisplay } from "./VideoCurrentTime";

const _VideoToolbar: React.FC<{
  ambientBackgroundEnabled: boolean;
  zIndex?: number;
}> = ({ ambientBackgroundEnabled, zIndex }) => {
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
  const backendPdfAnalyzerApiState = useAtomValue(
    backendPdfAnalyzerApiStateAtom
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

  const ToolbarCenterPanelContent = useMemo(() => {
    if (!pdfRendererState.loaded) {
      return <NotificationPdfUnavailableOnClient />;
    }

    /**
     * Sequence Analyzer is disabled, but no pre-generated ScrollTimelineData is available
     */
    if (!sequenceAnalyzerEnabled && !preGeneratedScrollTimelineData) {
      return <NotificationPreGeneratedTimelineUnavailable />;
    }

    /**
     * Sequence Analyzer is enabled
     */
    if (sequenceAnalyzerEnabled) {
      /**
       * Backend api is not running (no response from the server)
       */
      if (!sequenceAnalyzerState.running) {
        return <NotificationSequenceAnalyzerStopped />;
      }

      /**
       * The client has connected to the server,
       * but the PDF data and its analysis data (**.index.json) do not exist on backend.
       *
       * If the backendPdfAnalyzerApiState is not null, the client is waiting for the server to complete pdf analysis.
       */
      if (!sequenceAnalyzerState.pdfAvailable) {
        return backendPdfAnalyzerApiState ? (
          <NotificationAnalyzingPdfOnServer
            progress={backendPdfAnalyzerApiState.progress}
          />
        ) : (
          <NotificationPdfUnavailableOnServer />
        );
      }
    }

    /**
     * documentPlayer is not on standby, where the scene does not contain a document
     */
    if (!documentPlayerStandby) {
      return null;
    }

    return documentPlayerActive ? (
      <NotificationDocumentPlayerActive />
    ) : (
      <NotificationDocumentPlayerStandby
        sequenceAnalyzerEnabled={sequenceAnalyzerEnabled}
      />
    );
  }, [
    backendPdfAnalyzerApiState,
    documentPlayerActive,
    documentPlayerStandby,
    pdfRendererState.loaded,
    preGeneratedScrollTimelineData,
    sequenceAnalyzerEnabled,
    sequenceAnalyzerState.pdfAvailable,
    sequenceAnalyzerState.running,
  ]);

  return (
    <div
      id="video_toolbar"
      className={`text-white select-none ${wrapperStyle}`}
      style={{
        zIndex: zIndex ?? "auto",
      }}
    >
      {/* Left Panels */}
      <div className="flex justify-between">
        <VideoPlayAndPauseButton
          videoPaused={videoElementState.paused}
          handleClickPlayAndPauseButton={handlePlayAndPauseButtonClick}
        />

        <p className="flex items-center text-lg h-full select-none px-4">
          <VideoCurrentTimeDisplay liveModeEnabled={liveStreamingEnabled} />
        </p>

        <VideoVolumeSlider
          videoVolume={videoElementState.volume}
          handleChangeVideoVolumeSlider={handleChangeVideoVolumeSlider}
          handleToggleVideoVolumeMuted={handleToggleChangeVideoVolumeMuted}
        />
      </div>

      {/* Center Panels (visble only when combined view is enabled) */}
      {interfaceType === "combined" && (
        <div className="flex-xyc flex-col">{ToolbarCenterPanelContent}</div>
      )}

      {/* Right Panels */}
      <div className="flex justify-between gap-2">
        <DocumentOverviewSwitch
          documentPlayerActive={documentPlayerActive}
          documentOverviewActive={documentOverviewActive}
          hideDocumentOverviewButtonEnabled={false}
          handleDocumentOverviewButtonClick={handleDocumentOverviewButtonClick}
        />

        <PipVideoWindowSwitch
          documentPlayerActive={documentPlayerActive}
          pipVideoWindowActive={pipVideoWindowActive}
          handlePiPVideoWindowButtonClick={handlePiPVideoWindowButonClick}
        />

        <PlayerSwitch
          documentPlayerActive={documentPlayerActive}
          handlePlayerButtonClick={handlePlayerButtonClick}
        />

        <SubtitlesSwitch
          subtitlesActive={subtitlesActive}
          handleSubtitlesButtonClick={handleSubtitlesButtonClick}
        />
      </div>
    </div>
  );
};

export const VideoToolbar = React.memo(_VideoToolbar);
