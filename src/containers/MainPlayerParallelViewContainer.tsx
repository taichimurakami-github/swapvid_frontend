import { useEffect, useRef } from "react";

import { useVideoPlayerCore } from "@hooks/useVideoPlayerCore";
import {
  useAssetDataCtx,
  useDocumentPlayerStateCtx,
  useDispatchDocumentPlayerStateCtx,
} from "@hooks/useContextConsumer";

import DocumentOverviewContainer from "@containers/DocumentOverviewContainer";
import DocumentPlayerParallelContainer from "@/containers/DocumentPlayerParallelLocalContainer";
import VideoSubtitle from "@containers/VideoSubtitlesContainer";
import { LoadingScreen } from "@ui/LoadingScreen";
import VideoSeekbar from "@ui/VideoSeekbar";
import VideoToolbar from "@ui/VideoToolbar";
import { UIELEM_ID_LIST } from "@/app.config";

// 一時的にアセットを直接インポートする
// import EdanMeyerVptActivityTimeline from "@assets/EdanMeyerVpt/EdanMeyerVpt.activities.json";
// import EdanMeyerVptBaseImg from "@assets/EdanMeyerVpt/EdanMeyerVpt.concat.png";
// import DocumentPlayerContainer from "./DocumentPlayerContainerFromImg";

export default function MainPlayerParallelViewContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    videoPlayerState,
    assetDataState,
    // setVideoPlayerState,
    handleOnWating,
    handleOnCanPlay,
    handleOnPlay,
    handleOnPause,
    handleOnLoadedData,
    handleVideoElementMuted,
    handleVideoElementPaused,
    handleVideoSubtitlesActive,
  } = useVideoPlayerCore(videoRef);

  const { documentPlayerAssets } = useAssetDataCtx();

  const documentPlayerState = useDocumentPlayerStateCtx();
  const dispatchDocumentPlayerState = useDispatchDocumentPlayerStateCtx();

  const documentAreaWrapperRef = useRef<HTMLDivElement>(null);

  // const setDocumentPlayerStateActive = useCallback((value: boolean) => {
  //   dispatchDocumentPlayerState({ active: value });
  // }, []);

  useEffect(() => {
    if (dispatchDocumentPlayerState) {
      dispatchDocumentPlayerState({ type: "update_active", value: true });
    }
  }, []);

  /**
   * Todo: useDocumentPlayerCoreを作りたい
   * 1. document playerおよびそれ以外のモジュールで使用する共通データ(state, refなど)の切り出し
   * 2. 1.に伴う初期化・アップデート等のデータ処理を行う関数モジュール群の実装
   * 3. その他document player関連の機能を使用するにあたって必要な共通処理をまとめる
   */

  return (
    <div className="parallel-view-container flex-xyc gap-8">
      <div className="video-player-container">
        <div className="relative max-w-[1440px] z-0 w-[1fr]">
          <video
            id={UIELEM_ID_LIST.system.videoPlayer.videoElement}
            className="max-w-full"
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

          {!videoPlayerState.loading && !assetDataState.assetsReady && (
            <div className="absolute top-0 left-0 w-full h-full">
              <LoadingScreen />
            </div>
          )}

          {videoRef.current && (
            <VideoSubtitle
              videoElement={videoRef.current}
              subtitlesData={assetDataState.subtitlesData}
              active={videoPlayerState.subtitlesActive}
            />
          )}
        </div>

        <div className="bg-black h-[5px] w-full"></div>

        {videoRef.current && assetDataState.assetsReady && (
          <VideoSeekbar
            active={true}
            videoElement={videoRef.current}
            documentPlayerActive={!!documentPlayerState?.active}
            // documentActiveTimes={documentPlayerState.activeTimes}
            onHandleSetPlayerActive={(_) => {
              return;
            }}
          />
        )}

        {videoRef.current && (
          <VideoToolbar
            videoElement={videoRef.current}
            videoElementPaused={videoPlayerState.paused}
            videoElementMuted={videoPlayerState.muted}
            videoSubtitlesActive={videoPlayerState.subtitlesActive}
            documentAvailable={true}
            documentPlayerActive={!!documentPlayerState?.active}
            documentPlayerStandby={!!documentPlayerState?.standby}
            documentOverviewActive={false}
            draggableVideoActive={false}
            onHandlePlayAndPauseButtonClick={handleVideoElementPaused}
            onSubtitlesButtonClick={handleVideoSubtitlesActive}
            onHandleMuteButtonClick={handleVideoElementMuted}
            disableAmbientBackground
            // onHandleSetPlayerActive={setDocumentPlayerStateActive}
            // onHandleVideoElementMuted={handleVideoElementMuted}
            // onHandleVideoElementPaused={handleVideoElementPaused}
            // onHandleVideoSubtitlesActive={handleVideoSubtitlesActive}
          />
        )}
      </div>

      <div
        className="document-player-container relative w-[50vw] h-screen flex-xyc gap-2"
        ref={documentAreaWrapperRef}
      >
        {documentAreaWrapperRef.current && (
          <>
            {videoRef.current && (
              <div className="w-full h-full">
                <DocumentPlayerParallelContainer
                  widthPx={documentAreaWrapperRef.current.clientWidth - 350}
                  heightPx={documentAreaWrapperRef.current.clientHeight}
                  videoElement={videoRef.current}
                  documentBaseImageSrc={documentPlayerAssets.baseImageSrc}
                  pdfSrc={documentPlayerAssets.pdfSrc}
                  scrollTimeline={documentPlayerAssets.scrollTl}
                  activityTimeline={documentPlayerAssets.activityTl}
                  enableDispatchVideoElementClickEvent={true}
                  playerActive={!!documentPlayerState?.active}
                  enableCenteredScrollYBaseline={true}
                ></DocumentPlayerParallelContainer>
              </div>
            )}

            <DocumentOverviewContainer
              active={true}
              widthPx={350}
              heightPx={documentAreaWrapperRef.current.clientHeight}
            />
          </>
        )}
      </div>
    </div>
  );
}
