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
  useDispatchDocumentPlayerStateCtx,
  useVideoCropAreaCtx,
} from "@hooks/useContextConsumer";
import { useVideoPlayerCore } from "@hooks/useVideoPlayerCore";

import DocumentPlayerCombinedLiveContainer from "./DocumentPlayerCombinedLiveContainer";
import DraggableVideoContainer from "@containers/DraggableVideoContainer";
import DocumentOverviewContainer from "./DocumentOverviewContainer";

import { DOMRectLike, TAssetId } from "@/types/swapvid";
import { UIELEM_ID_LIST } from "@/app.config";
import "@styles/MainPlayerCombinedViewContainer.scss";
import DebugInfoDialogSqaRespContainer from "./DebugInfoDialogSqaRespContainer";
// import DebugInfoDialogDocumentCtxContainer from "./DebugInfoDialogDocumentCtxContainer";
import { useDesktopCapture } from "@hooks/useDesktopCapture";
import RenderedElementCropperContainer from "./RenderedElementCropperContainer";
import PDFUplorderContainer from "./PDFUplorderContainer";

export default function MainPlayerCombinedViewLiveContainer(
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

  const { startCaptureDesktop } = useDesktopCapture(videoRef);
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

  const [pdfUploaderActive, setPdfUploaderActive] = useState(false);

  const handlePdfUploaderActive = useCallback((value?: boolean) => {
    setPdfUploaderActive((b) => (value !== undefined ? value : !b));
  }, []);

  const [cropperActive, setCropperActive] = useState(false);

  const handleCropperActive = useCallback(
    (value?: boolean) => {
      setCropperActive((b) => (value !== undefined ? value : !b));
    },
    [setCropperActive]
  );

  const handleCropperSubmit = useCallback(
    (cropArea: { raw: DOMRectLike; videoScale: DOMRectLike }) => {
      console.log(cropArea);
    },
    []
  );

  const animationTriggerClassname = documentPlayerState?.active
    ? "active"
    : "unactive";

  // const overflowModeEnabledClassname = props.enableOverflowMode
  //   ? "overflow"
  //   : "";

  useEffect(() => {
    dispatchDocumentPlayerState &&
      dispatchDocumentPlayerState({ type: "update_active", value: false });
  }, []);

  if (!documentPlayerAssets.assetsReady) {
    return <div>Loading assets...</div>;
  }

  return (
    // {/* <div className="video-player-container w-screen h-screen flex-col items-center justify-center pt-[100px]"></div> */}
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
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
                  style={{
                    height: props.enableOverflowMode ? "100vh" : "100%",
                  }}
                >
                  <DocumentPlayerCombinedLiveContainer
                    videoElement={videoRef.current}
                    assetId={props.assetId}
                    documentBaseImageSrc={documentPlayerAssets.baseImageSrc}
                    pdfSrc={documentPlayerAssets.pdfSrc}
                    enableCombinedView={true}
                    scrollTimeline={documentPlayerAssets.scrollTl}
                    activityTimeline={documentPlayerAssets.activityTl}
                    enableDispatchVideoElementClickEvent={true}
                    playerActive={!!documentPlayerState?.active}
                    enableCenteredScrollYBaseline={true}
                  ></DocumentPlayerCombinedLiveContainer>
                </div>

                {documentPlayerState?.active && documentOverviewActive && (
                  <div className="absolute left-0 top-0 w-full h-full bg-black opacity-10 pointer-events-none"></div>
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
                        !!documentPlayerState?.active && documentOverviewActive
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
              documentPlayerState?.active &&
              draggableVideoActive && (
                <div className="absolute bottom-[95px] right-0 w-full z-0">
                  <DraggableVideoContainer
                    active={documentPlayerState.active}
                    videoElement={videoRef.current}
                    movieSrc={videoRef.current.currentSrc}
                    onHandleClick={() => {
                      dispatchDocumentPlayerState &&
                        dispatchDocumentPlayerState({
                          type: "update_active",
                          value: false,
                        });
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
                  active={videoRef.current.duration !== Infinity}
                  zIndex={1}
                  videoElement={videoRef.current}
                  onHandleSetPlayerActive={setDocumentPlayerStateActive}
                  // documentActiveTimes={documentPlayerState.activeTimes}
                  documentPlayerActive={!!documentPlayerState?.active}
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
              />
            </div>
          </div>
        )}
        {documentPlayerState?.active && !documentOverviewActive && (
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

      <div className="mt-[50px] flex gap-4">
        <button
          className="p-2 bg-blue-600 text-white text-xl font-bold"
          onClick={() => handleCropperActive(true)}
        >
          Crop Video Area
        </button>
        <button
          className="p-2 bg-blue-600 text-white text-xl font-bold"
          onClick={startCaptureDesktop}
        >
          Capture Desktop
        </button>
        <button
          className="p-2 bg-blue-600 text-white text-xl font-bold"
          onClick={() => handlePdfUploaderActive(true)}
        >
          Upload PDF
        </button>
        {/* <DebugInfoDialogDocumentCtxContainer /> */}
        <DebugInfoDialogSqaRespContainer />
      </div>

      <PDFUplorderContainer
        active={pdfUploaderActive}
        handleComponentActive={handlePdfUploaderActive}
      />

      <RenderedElementCropperContainer
        active={cropperActive}
        videoRef={videoRef}
        handleSubmitCropArea={handleCropperSubmit}
        handleComponentActive={handleCropperActive}
      />

      {/* <div className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-slate-400 grid gap-4 z-90 pointer-events-none">
        <canvas id="dbg_canvas_01" />
        <canvas id="dbg_canvas_02" />
      </div> */}
    </div>
  );
}
