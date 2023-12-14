import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import VideoSubtitle from "@containers/VideoSubtitlesContainer";
import { LoadingScreen } from "@ui/LoadingScreen";
import VideoSeekbar from "@ui/VideoSeekbar";
import VideoToolbar from "@ui/VideoToolbar";
import {
  useAssetDataCtx,
  useDocumentPlayerStateCtx,
  useSetDocumentPlayerStateCtx,
} from "@hooks/useContextConsumer";
import { useVideoPlayerCore } from "@hooks/useVideoPlayerCore";
import DocumentPlayerContainer from "@/containers/DocumentPlayerCombinedLocalContainer";
import DraggableVideoContainer from "@containers/DraggableVideoContainer";
import DocumentOverviewContainer from "@containers/DocumentOverviewContainer";
import DocumentCtxInfoShowcaseContainer from "./DebugInfoDialogDocumentCtxContainer";

import { TAssetId } from "@/types/swapvid";
import { UIELEM_ID_LIST } from "@/app.config";
import "@styles/MainPlayerCombinedViewContainer.scss";

export default function MainPlayerCombinedViewLocalContainer(
  props: PropsWithChildren<{ assetId: TAssetId; enableOverflowMode?: boolean }>
) {
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

  const [documentOverviewActive, setDocumentOverviewActive] = useState(false);
  const handleDocumentOverviewActive = useCallback(() => {
    setDocumentOverviewActive((b) => !b);
  }, [setDocumentOverviewActive]);

  const documentPlayerState = useDocumentPlayerStateCtx();
  const { documentPlayerAssets } = useAssetDataCtx();
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  const [draggableVideoActive, setDraggableVideoActive] = useState(true);

  const setDocumentPlayerStateActive = useCallback((value: boolean) => {
    setDocumentPlayerStateValues({ active: value });
  }, []);

  const handleDraggableVideoButtonClick = useCallback(() => {
    setDraggableVideoActive((b) => !b);
  }, [setDraggableVideoActive]);

  const animationTriggerClassname = documentPlayerState.active
    ? "active"
    : "unactive";

  // const overflowModeEnabledClassname = props.enableOverflowMode
  //   ? "overflow"
  //   : "";

  useEffect(() => {
    setDocumentPlayerStateValues({ active: false });
  }, []);

  if (!documentPlayerAssets.assetsReady) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="video-player-container w-screen h-screen flex-xyc flex-col">
      <div className="grid relative max-w-[1440px] max-h-[90%] z-0">
        <video
          id={UIELEM_ID_LIST.system.videoPlayer.videoElement}
          className="max-h-[75vh] z-0"
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
                  if (documentPlayerState.active && documentOverviewActive) {
                    setDocumentOverviewActive(false);
                  }
                }}
              >
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
                  style={{
                    height: props.enableOverflowMode ? "100vh" : "100%",
                  }}
                >
                  <DocumentPlayerContainer
                    videoElement={videoRef.current}
                    documentBaseImageSrc={documentPlayerAssets.baseImageSrc}
                    pdfSrc={documentPlayerAssets.pdfSrc}
                    enableCombinedView={true}
                    scrollTimeline={documentPlayerAssets.scrollTl}
                    activityTimeline={documentPlayerAssets.activityTl}
                    playerActive={documentPlayerState.active}
                    enableCenteredScrollYBaseline
                  ></DocumentPlayerContainer>
                </div>

                {documentPlayerState.active && documentOverviewActive && (
                  <div className="absolute left-0 top-0 w-full h-full bg-black opacity-30 pointer-events-none"></div>
                )}

                <div
                  className="absolute top-0 w-[15%] h-full"
                  style={{
                    pointerEvents: documentOverviewActive ? "auto" : "none",
                  }}
                >
                  {videoRef.current && (
                    <DocumentOverviewContainer
                      active={
                        documentPlayerState.active && documentOverviewActive
                      }
                      heightPx={videoRef.current.clientHeight}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        }
        {videoRef.current && (
          <div
            className={`video-controls-wrapper w-full z-10`}
            style={{
              top: videoRef.current.getBoundingClientRect().bottom,
              // width: videoRef.current.clientWidth,
              // top: documentPlayerState.active
              //   ? document.body.getBoundingClientRect().bottom
              //   : videoRef.current.getBoundingClientRect().bottom,
              // transform: documentPlayerState.active ? "translateY(-100%)" : "",
            }}
          >
            {videoRef.current &&
              documentPlayerState.active &&
              draggableVideoActive && (
                <div className="absolute bottom-[95px] right-0 w-full z-0">
                  <DraggableVideoContainer
                    active={documentPlayerState.active}
                    videoElement={videoRef.current}
                    movieSrc={videoRef.current.currentSrc}
                    onHandleClick={() => {
                      setDocumentPlayerStateValues({ active: false });
                    }}
                    onHandleClose={() => {
                      setDraggableVideoActive(false);
                    }}
                  />
                </div>
              )}

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
                  active
                  zIndex={1}
                  videoElement={videoRef.current}
                  onHandleSetPlayerActive={setDocumentPlayerStateActive}
                  documentActiveTimes={documentPlayerState.activeTimes}
                  documentPlayerActive={documentPlayerState.active}
                />
              )}
              {
                <VideoToolbar
                  zIndex={10}
                  videoElement={videoRef.current}
                  videoElementPaused={videoPlayerState.paused}
                  videoElementMuted={videoPlayerState.muted}
                  documentAvailable={true} // Always true because the document player loads local file
                  documentPlayerActive={documentPlayerState.active}
                  documentPlayerStandby={documentPlayerState.standby}
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
                />
              }
            </div>
          </div>
        )}

        {documentPlayerState.active && !documentOverviewActive && (
          <div
            className="absolute top-0 left-0 flex-xyc flex-col h-full w-[50px] opacity-0 hover:bg-black hover:opacity-90 text-white font-bold text-xl select-none"
            onClick={handleDocumentOverviewActive}
          >
            <span
              style={{
                writingMode: "vertical-rl",
              }}
            >
              &gt;&gt; Show Overview
            </span>
          </div>
        )}

        {!videoPlayerState.loading && !assetDataState.assetsReady && (
          <div className="absolute top-0 left-0 w-full h-screen z-50 loading-screen-wrapper">
            <LoadingScreen />
          </div>
        )}
      </div>

      <DocumentCtxInfoShowcaseContainer />
    </div>
  );
}
