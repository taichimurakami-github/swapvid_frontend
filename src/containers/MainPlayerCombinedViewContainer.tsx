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

import "@/styles/MainPlayerCombinedViewContainer.scss";
import DraggableVideo from "@/ui/DraggableVideo";

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
    <div className="video-player-container">
      <div className="relative max-w-[1440px] z-0">
        <video
          id={UIELEM_ID_LIST.system.videoPlayer.videoElement}
          className="max-w-full z-0"
          src={assetDataState.movieSrc}
          width={1920}
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
              className={`top-0 left-0 z-10 document-player-wrapper w-full h-full overflow-hidden ${animationTriggerClassname} `}
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

        {!videoPlayerState.loading && !assetDataState.assetsReady && (
          <div className="absolute top-0 left-0 w-full h-screen z-30 loading-screen-wrapper">
            <LoadingScreen />
          </div>
        )}

        {videoRef.current && (
          <DraggableVideo
            active={documentPlayerState.active}
            videoElement={videoRef.current}
            movieSrc={videoRef.current.currentSrc}
            onHandleClick={() => {
              setDocumentPlayerStateValues({ active: false });
            }}
          />
        )}
      </div>

      {videoRef.current && (
        <div
          className={`z-50 video-controls-wrapper`}
          style={{
            width: videoRef.current.clientWidth,
            top: videoRef.current.getBoundingClientRect().bottom,
            // top: documentPlayerState.active
            //   ? document.body.getBoundingClientRect().bottom
            //   : videoRef.current.getBoundingClientRect().bottom,
            // transform: documentPlayerState.active ? "translateY(-100%)" : "",
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

          <div className={`relative w-full pt-2 ${animationTriggerClassname}`}>
            {assetDataState.assetsReady && (
              <VideoSeekbar
                videoElement={videoRef.current}
                onHandleSetPlayerActive={setDocumentPlayerStateActive}
                documentActiveTimes={documentPlayerState.activeTimes}
                documentPlayerActive={documentPlayerState.active}
              />
            )}
            {
              <VideoToolbar
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

      <div
        className="document-player-close-btn-wrapper absolute top-0 right-0 bg-red-600 text-white"
        onClick={() => {
          setDocumentPlayerStateValues({ active: false });
        }}
      >
        <button>close document player</button>
      </div>
    </div>
  );
}
