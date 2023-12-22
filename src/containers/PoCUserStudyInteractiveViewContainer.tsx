import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useAssetDataCtx,
  useDocumentPlayerStateCtx,
  useDispatchDocumentPlayerStateCtx,
  useVideoCropAreaCtx,
} from "@hooks/useContextConsumer";
import { useVideoPlayerCore } from "@hooks/useVideoPlayerCore";

import VideoSubtitle from "@containers/VideoSubtitlesContainer";
import DocumentPlayerCombinedLocalContainer from "@/containers/DocumentPlayerCombinedLocalContainer";
import { LoadingScreen } from "@ui/LoadingScreen";
import VideoSeekbar from "@ui/VideoSeekbar";
import VideoToolbar from "@ui/VideoToolbar";

import { UIELEM_ID_LIST } from "@/app.config";

import "@styles/MainPlayerCombinedViewContainer.scss";

export default function PoCUserStudyInteractiveViewContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    videoPlayerState,
    assetDataState,
    handleOnWating,
    handleOnCanPlay,
    handleOnPlay,
    handleOnPause,
    handleOnLoadedData,
    handleVideoElementMuted,
    handleVideoElementPaused,
    handleVideoSubtitlesActive,
  } = useVideoPlayerCore(videoRef);

  const videoCropArea = useVideoCropAreaCtx();

  const [documentOverviewActive, setDocumentOverviewActive] = useState(false);
  const handleDocumentOverviewActive = useCallback(() => {
    setDocumentOverviewActive((b) => !b);
  }, [setDocumentOverviewActive]);

  const documentPlayerState = useDocumentPlayerStateCtx();
  const { documentPlayerAssets } = useAssetDataCtx();
  const dispatchDocumentPlayerState = useDispatchDocumentPlayerStateCtx();

  const [draggableVideoActive, setDraggableVideoActive] = useState(true);

  const setDocumentPlayerStateActive = useCallback((value: boolean) => {
    dispatchDocumentPlayerState &&
      dispatchDocumentPlayerState({ type: "update_active", value });
  }, []);

  const handleDraggableVideoButtonClick = useCallback(() => {
    setDraggableVideoActive((b) => !b);
  }, [setDraggableVideoActive]);

  const animationTriggerClassname = documentPlayerState?.active
    ? "active"
    : "unactive";

  useEffect(() => {
    dispatchDocumentPlayerState &&
      dispatchDocumentPlayerState({ type: "update_active", value: false });
  }, []);

  if (!documentPlayerAssets.assetsReady) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="video-player-container w-screen h-screen flex-xyc flex-col">
      <div className="grid relative max-h-[90%] z-0">
        <video
          id={UIELEM_ID_LIST.system.videoPlayer.videoElement}
          className="max-h-[75vh] z-0"
          width={1920}
          src={assetDataState.movieSrc}
          ref={videoRef}
          loop={false}
          autoPlay={true}
          onClick={(e) => {
            e.preventDefault();
            handleVideoElementPaused(!e.currentTarget.paused);
          }}
          onWaiting={handleOnWating}
          onCanPlay={handleOnCanPlay}
          onLoadedData={handleOnLoadedData}
          onPause={handleOnPause}
          onPlay={handleOnPlay}
        />

        {videoRef.current && videoCropArea && (
          <div
            className="absolute pointer-events-none bg-[rgba(0,0,0,0.35)] border-4 border-white border-blue-400 border-dashed"
            style={{
              top: videoCropArea.videoScale.top,
              left: videoCropArea.videoScale.left,
              width: videoCropArea.videoScale.width,
              height: videoCropArea.videoScale.height,
            }}
          ></div>
        )}

        {
          // Document Player
          videoRef.current && (
            <div
              id="document_player_outer"
              className={`top-0 left-0 z-0 document-player-wrapper w-full h-full ${animationTriggerClassname} `}
            >
              <div
                className="relative w-full h-full"
                onClick={() => {
                  if (documentPlayerState?.active && documentOverviewActive) {
                    setDocumentOverviewActive(false);
                  }
                }}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-full">
                  <DocumentPlayerCombinedLocalContainer
                    videoElement={videoRef.current}
                    documentBaseImageSrc={documentPlayerAssets.baseImageSrc}
                    pdfSrc={documentPlayerAssets.pdfSrc}
                    scrollTimeline={documentPlayerAssets.scrollTl}
                    activityTimeline={documentPlayerAssets.activityTl}
                    playerActive={!!documentPlayerState?.active}
                    enableCombinedView
                    enableCenteredScrollYBaseline
                    forceToActivatePlayerByUserManipulation
                    disableTextLayer
                    disableVideoViewportVisualization
                  ></DocumentPlayerCombinedLocalContainer>
                </div>

                {documentPlayerState?.active && documentOverviewActive && (
                  <div className="absolute left-0 top-0 w-full h-full bg-black opacity-10 pointer-events-none"></div>
                )}
              </div>
            </div>
          )
        }
        {videoRef.current && (
          <div
            className={`video-controls-wrapper w-full z-10`}
            style={{
              top: videoRef.current.getBoundingClientRect().bottom,
            }}
          >
            <div className="relative bottom-[0px]">
              <VideoSubtitle
                videoElement={videoRef.current}
                subtitlesData={assetDataState.subtitlesData}
                active={videoPlayerState.subtitlesActive}
                zIndex={40}
              />
            </div>

            <div
              className={`relative w-full pt-2 ${animationTriggerClassname}`}
            >
              {assetDataState.assetsReady && (
                <VideoSeekbar
                  active={videoRef.current.duration !== Infinity}
                  zIndex={1}
                  videoElement={videoRef.current}
                  onHandleSetPlayerActive={setDocumentPlayerStateActive}
                  // documentActiveTimes={documentPlayerState.activeTimes}
                  documentPlayerActive={!!documentPlayerState?.active}
                  disableViewportEffectOnSeekbarHighlight
                />
              )}
              <VideoToolbar
                zIndex={10}
                videoElement={videoRef.current}
                videoElementPaused={videoPlayerState.paused}
                videoElementMuted={videoPlayerState.muted}
                documentAvailable={!!documentPlayerState?.documentAvailable}
                documentPlayerActive={!!documentPlayerState?.active}
                documentPlayerStandby={!!documentPlayerState?.standby}
                documentOverviewActive={documentOverviewActive}
                draggableVideoActive={draggableVideoActive}
                videoSubtitlesActive={
                  assetDataState.subtitlesDataReady &&
                  videoPlayerState.subtitlesActive
                }
                onHandleMuteButtonClick={handleVideoElementMuted}
                onHandleDocumentOverviewButtonClick={
                  handleDocumentOverviewActive
                }
                onDocumentPlayerButtonClick={setDocumentPlayerStateActive}
                onSubtitlesButtonClick={handleVideoSubtitlesActive}
                onDraggableVideoButtonClick={handleDraggableVideoButtonClick}
                enablePoCUserStudyInteractiveMode
              />
            </div>
          </div>
        )}
        {!videoPlayerState.loading && !assetDataState.assetsReady && (
          <div className="absolute top-0 left-0 w-full h-screen z-50 loading-screen-wrapper">
            <LoadingScreen />
          </div>
        )}
      </div>
    </div>
  );
}
