import { useVideoPlayerCore } from "@/hooks/useVideoPlayerCore";

import VideoSubtitle from "@/containers/VideoSubtitlesContainer";
import { LoadingScreen } from "@/ui/LoadingScreen";
import VideoSeekbar from "@/ui/VideoSeekbar";
import VideoToolbar from "@/ui/VideoToolbar";

import {
  TAssetId,
  // TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/@types/types";

import { UIELEM_ID_LIST } from "@/app.config";
import { PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import {
  useAssetDataCtx,
  useDocumentPlayerStateCtx,
  useSetDocumentPlayerStateCtx,
} from "@/hooks/useContextConsumer";
import DocumentOverviewContainer from "./DocumentOverviewContainer";

// 一時的にアセットを直接インポートする
// import EdanMeyerVptActivityTimeline from "@/assets/EdanMeyerVpt/EdanMeyerVpt.activities.json";
import EdanMeyerVptBaseImg from "@/assets/EdanMeyerVpt/EdanMeyerVpt.concat.png";
import DocumentPlayerContainer from "./DocumentPlayerContainerFromImg";

export default function MainPlayerPVServerComponentTest(
  props: PropsWithChildren<{
    assetId: TAssetId;
    invidActivitiesReenactmentActive?: boolean;
  }>
) {
  const {
    videoPlayerState,
    videoRef,
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
  } = useVideoPlayerCore(props.assetId);

  const { documentPlayerAssets } = useAssetDataCtx();

  const documentPlayerState = useDocumentPlayerStateCtx();
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  const setDocumentPlayerStateActive = useCallback((value: boolean) => {
    setDocumentPlayerStateValues({ active: value });
  }, []);

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
    <div className="parallel-view-container flex-xyc gap-4">
      <div className="video-player-container">
        <div className="relative  max-w-[1440px] z-0">
          <video
            id={UIELEM_ID_LIST.system.videoPlayer.videoElement}
            className="max-w-full"
            src={assetDataState.movieSrc}
            width={1920}
            ref={videoRef}
            loop={false}
            autoPlay={false}
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
            videoElement={videoRef.current}
            onHandleSetPlayerActive={(_v: boolean) => {
              return;
            }}
            documentActiveTimes={documentPlayerState.activeTimes}
            documentPlayerActive={documentPlayerState.active}
          />
        )}
        {videoRef.current && (
          <VideoToolbar
            videoElement={videoRef.current}
            videoElementPaused={videoPlayerState.paused}
            videoElementMuted={videoPlayerState.muted}
            documentPlayerActive={false}
            documentPlayerStandby={false}
            videoSubtitlesActive={
              assetDataState.subtitlesDataReady &&
              videoPlayerState.subtitlesActive
            }
            onHandleMuteButtonClick={handleVideoElementMuted}
            onDocumentPlayerButtonClick={setDocumentPlayerStateActive}
            onSubtitlesButtonClick={handleVideoSubtitlesActive}
          />
        )}
      </div>
      <div className="document-player-container relative w-[50%] h-screen flex-xyc gap-2">
        {videoRef.current && <DocumentOverviewContainer active={true} />}
        {
          // Document Player
          videoRef.current && (
            <div className="w-full h-full">
              <DocumentPlayerContainer
                videoElement={videoRef.current}
                playerActive={true} //PlayerActive always must be true when ParallelView is enabled
                documentBaseImageSrc={documentPlayerAssets.baseImageSrc}
                scrollTimeline={documentPlayerAssets.scrollTl}
                activityTimeline={documentPlayerAssets.activityTl}
                enableInvidActivitiesReenactment={
                  props.invidActivitiesReenactmentActive
                }
              ></DocumentPlayerContainer>
            </div>
          )
        }
      </div>
    </div>
  );
}
