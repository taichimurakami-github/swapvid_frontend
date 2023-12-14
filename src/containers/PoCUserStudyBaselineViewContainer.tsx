import React, { PropsWithChildren } from "react";

import { useVideoPlayerCore } from "@hooks/useVideoPlayerCore";

import VideoSubtitle from "@containers/VideoSubtitlesContainer";
import { LoadingScreen } from "@ui/LoadingScreen";
import VideoSeekbar from "@ui/VideoSeekbar";
import VideoToolbar from "@ui/VideoToolbar";

import { UIELEM_ID_LIST } from "@/app.config";
import { useEffect, useRef } from "react";
import {
  useAssetDataCtx,
  useDocumentPlayerStateCtx,
  useSetDocumentPlayerStateCtx,
} from "@hooks/useContextConsumer";
import DocumentPlayerParallelContainer from "@/containers/DocumentPlayerParallelLocalContainer";
import { TAssetId } from "@/types/swapvid";

export default function PoCUserStudyBaselineViewContainer(
  props: PropsWithChildren<{
    assetId: TAssetId;
    videoWidthPx?: number;
    documentWidthPx?: number;
  }>
) {
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
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  const documentAreaWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDocumentPlayerStateValues({ active: true });
  }, []);

  /**
   * Todo: useDocumentPlayerCoreを作りたい
   * 1. document playerおよびそれ以外のモジュールで使用する共通データ(state, refなど)の切り出し
   * 2. 1.に伴う初期化・アップデート等のデータ処理を行う関数モジュール群の実装
   * 3. その他document player関連の機能を使用するにあたって必要な共通処理をまとめる
   */

  return (
    <div className="parallel-view-container flex-xyc gap-[100px]">
      <div className="video-player-container">
        <div className="relative max-w-[1440px] z-0 w-[1fr]">
          <video
            id={UIELEM_ID_LIST.system.videoPlayer.videoElement}
            className="max-w-full"
            src={assetDataState.movieSrc}
            width={props.videoWidthPx ?? 1920}
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
            documentPlayerActive={documentPlayerState.active}
            documentActiveTimes={documentPlayerState.activeTimes}
            onHandleSetPlayerActive={(_) => {
              return;
            }}
            disableSeekbarHighlight
          />
        )}

        {videoRef.current && (
          <VideoToolbar
            videoElement={videoRef.current}
            videoElementPaused={videoPlayerState.paused}
            videoElementMuted={videoPlayerState.muted}
            videoSubtitlesActive={videoPlayerState.subtitlesActive}
            documentAvailable={true}
            documentPlayerActive={documentPlayerState.active}
            documentPlayerStandby={documentPlayerState.standby}
            documentOverviewActive={false}
            draggableVideoActive={false}
            onHandlePlayAndPauseButtonClick={handleVideoElementPaused}
            onSubtitlesButtonClick={handleVideoSubtitlesActive}
            onHandleMuteButtonClick={handleVideoElementMuted}
            enablePoCUserStudyBaselineMode
            disableAmbientBackground
          />
        )}
      </div>

      <div
        className="document-player-container relative h-screen flex-xyc gap-2"
        ref={documentAreaWrapperRef}
        style={{
          width: props.documentWidthPx ?? "45vw",
        }}
      >
        {documentAreaWrapperRef.current && videoRef.current && (
          <div className="w-full h-full">
            <DocumentPlayerParallelContainer
              widthPx={documentAreaWrapperRef.current.clientWidth}
              heightPx={documentAreaWrapperRef.current.clientHeight}
              videoElement={videoRef.current}
              documentBaseImageSrc={documentPlayerAssets.baseImageSrc}
              pdfSrc={documentPlayerAssets.pdfSrc}
              scrollTimeline={documentPlayerAssets.scrollTl}
              activityTimeline={documentPlayerAssets.activityTl}
              enableDispatchVideoElementClickEvent={true}
              playerActive={documentPlayerState.active}
              enableCenteredScrollYBaseline={true}
              pageZoomRate={
                ["EdanMeyerVpt", "EdanMeyerAlphaCode"].includes(props.assetId)
                  ? 1.3
                  : 1
              }
              showScrollBar
              disableTextLayer
              disableVideoViewportVisualization
            ></DocumentPlayerParallelContainer>
          </div>
        )}
      </div>
    </div>
  );
}
