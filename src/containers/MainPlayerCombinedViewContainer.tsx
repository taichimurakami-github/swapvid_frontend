import { useVideoPlayerCore } from "@/hooks/useVideoPlayerCore";

import VideoSubtitle from "@/containers/VideoSubtitlesContainer";
import { LoadingScreen } from "@/ui/LoadingScreen";
import VideoSeekbar from "@/ui/VideoSeekbar";
import VideoToolbar from "@/ui/VideoToolbar";

import { TAssetId } from "@/@types/types";

import { UIELEM_ID_LIST } from "@/app.config";
import { PropsWithChildren, useCallback, useEffect } from "react";
import {
  useAssetDataCtx,
  useDocumentPlayerStateCtx,
  useSetDocumentPlayerStateCtx,
} from "@/hooks/useContextConsumer";
import DocumentPlayerContainer from "./DocumentPlayerContainer";
import DraggableVideo from "@/ui/DraggableVideo";
import "@/styles/MainPlayerCombinedViewContainer.scss";
import DocumentOverviewContainer from "./DocumentOverviewContainer";
import DocumentCtxInfoShowcaseContainer from "./DocumentCtxInfoShowcaseContainer";

export default function MainPlayerCombinedViewContainer(
  props: PropsWithChildren<{ assetId: TAssetId; enableOverflowMode?: boolean }>
) {
  const {
    videoPlayerState,
    videoRef,
    assetDataState,
    handleOnWating,
    handleOnCanPlay,
    handleOnPlay,
    handleOnPause,
    handleOnLoadedData,
    handleVideoElementMuted,
    handleVideoElementPaused,
    handleVideoSubtitlesActive,
  } = useVideoPlayerCore(props.assetId);

  const documentPlayerState = useDocumentPlayerStateCtx();
  const { documentPlayerAssets } = useAssetDataCtx();
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  const setDocumentPlayerStateActive = useCallback((value: boolean) => {
    setDocumentPlayerStateValues({ active: value });
  }, []);

  const animationTriggerClassname = documentPlayerState.active
    ? "active"
    : "unactive";

  const overflowModeEnabledClassname = props.enableOverflowMode
    ? "overflow"
    : "";

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
              <div className="relative w-full h-full">
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
                    enableDispatchVideoElementClickEvent={true}
                    playerActive={documentPlayerState.active}
                    enableCenteredScrollYBaseline={true}
                  ></DocumentPlayerContainer>
                </div>
              </div>
            </div>
          )
        }

        <div className="absolute top-0 left-[-15.5%] w-[15%] h-full">
          <DocumentOverviewContainer active={documentPlayerState.active} />
        </div>

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
            {videoRef.current && documentPlayerState.active && (
              <div className="absolute bottom-[95px] right-0 w-full z-0">
                <DraggableVideo
                  active={documentPlayerState.active}
                  videoElement={videoRef.current}
                  movieSrc={videoRef.current.currentSrc}
                  onHandleClick={() => {
                    setDocumentPlayerStateValues({ active: false });
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
                  documentPlayerActive={documentPlayerState.active}
                  documentPlayerStandby={documentPlayerState.standby}
                  videoSubtitlesActive={
                    assetDataState.subtitlesDataReady &&
                    videoPlayerState.subtitlesActive
                  }
                  onHandleMuteButtonClick={handleVideoElementMuted}
                  onDocumentPlayerButtonClick={setDocumentPlayerStateActive}
                  onSubtitlesButtonClick={handleVideoSubtitlesActive}
                />
              }
            </div>
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
