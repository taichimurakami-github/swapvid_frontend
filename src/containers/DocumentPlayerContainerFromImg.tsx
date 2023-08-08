import React, {
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
  useState,
} from "react";
import {
  TDocumentTimeline,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/@types/types";
import { useVideoCurrenttime } from "@/hooks/useVideoCurrenttime";
import {
  // useDocumentPlayerStateCtx,
  useSetDocumentPlayerStateCtx,
} from "@/hooks/useContextConsumer";
import OnDocumentGuideArea from "@/ui/OnDocumentGuideArea";
import {
  useDocumentActivityTimeline,
  useDocumentScrollTimeline,
} from "@/hooks/useDocumentTimeline";
import { cvtToTLWHArray, cvtToWHArray } from "@/utils/bboxUtil";

export default function DocumentPlayerContainerFromImg(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    scrollTimeline: TServerGeneratedScrollTimeline | null;
    activityTimeline: TServerGeneratedActivityTimeline | null;
    playerActive: boolean;
    documentBaseImageSrc: string;
    scrollWrapperId?: string;
    enableDispatchVideoElementClickEvent?: boolean;
    enableCombinedView?: boolean;
    scrollWrapperOpacityWhenUnactive?: number;
    enableCenteredScrollYBaseline?: boolean;
    enableInvidActivitiesReenactment?: boolean;
    disableUnactiveAnimation?: boolean;
  }>
) {
  const videoElement = props.videoElement;
  const currentTime = useVideoCurrenttime(props.videoElement);
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();
  const playerActive = props.playerActive;

  // const [currTlSecId, setCurrTlSecId] = useState(0);

  const { timeline } = useDocumentScrollTimeline(
    props.scrollTimeline || {
      media_metadata: [0, 0, 0, 0],
      document_metadata: [0, 0],
      tl_document_scrollY: [],
    }
  );

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const baseImageRef = useRef<HTMLImageElement>(null);
  const guideAreaWrapperRef = useRef<HTMLDivElement>(null);
  const {
    // activityState,
    updateAcitvityState,
    // getActivityAssets,
    // getAssetsMetadata,
  } = useDocumentActivityTimeline(
    props?.activityTimeline ?? {
      video_metadata: [0, 0],
      doc_metadata: [0, 0],
      activities: [],
    },
    props.scrollTimeline ?? {
      media_metadata: [0, 0, 0, 0],
      document_metadata: [0, 0],
      tl_document_scrollY: [],
    },
    videoElement,
    scrollWrapperRef.current
  );

  const [guideAreaStyles, setGuideAreaStyles] = useState<{
    top: number | string;
    left: number | string;
    width: number | string;
    height: number | string;
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // for player animation when on/off
  const animateEffectActive = useRef(false);
  const animating = useRef(false);

  const convertScrollYToBeCentered = useCallback(
    (scrollY: number) =>
      scrollY - props.videoElement.getBoundingClientRect().top,
    [props.videoElement, scrollWrapperRef]
  );

  const getActiveTlSectionFromPlaytime = useCallback(
    (time: number, maxScrollY: number): TDocumentTimeline[0] | null => {
      const currentSection =
        timeline.find((v) => v.time[0] <= time && time < v.time[1]) ?? null;

      return currentSection;
    },
    [timeline]
  );

  const getPlaytimeFromInDocScrollY = useCallback(
    (
      currentScrollY: number,
      maxScrollY: number,
      videoDuration: number
    ): [number, number][] => {
      const MARGIN = 150;
      const targetSections = timeline.filter((v) => {
        const onFocusAreaTop = v.invidFocusedArea[0][1];

        return (
          onFocusAreaTop * maxScrollY - MARGIN <= currentScrollY && //Is current scroll Y larger than onFocusArea.top ?
          currentScrollY <= onFocusAreaTop * maxScrollY + MARGIN //Is current scroll Y smaller than onFocusArea.top ?
        );
      });

      return targetSections.map((v) => {
        return videoDuration < v.time[1] //time[1]がInfinityの場合，ビデオの終了まで位置が持続するとみなす
          ? [v.time[0], videoDuration] //time[start, videoEnd]に置換
          : v.time; //time[start, end] をそのまま代入
      });
    },
    [timeline]
  );

  const updateDocumentState = useCallback(() => {
    if (baseImageRef.current && scrollWrapperRef.current) {
      const currDocScrollY = scrollWrapperRef.current.scrollTop;
      const currDocLeft = 0;
      const currDocTop = currDocScrollY / baseImageRef.current.clientHeight;
      const currDocWidth =
        scrollWrapperRef.current.clientWidth / baseImageRef.current.clientWidth;
      const currDocHeight =
        scrollWrapperRef.current.clientHeight /
        baseImageRef.current.clientHeight;

      const activeTimes = getPlaytimeFromInDocScrollY(
        currDocScrollY,
        baseImageRef.current.clientHeight,
        videoElement.duration
      );

      setDocumentPlayerStateValues({
        baseImgSrc: props.documentBaseImageSrc,
        documentOnFocusArea: [
          [currDocLeft, currDocTop],
          [currDocLeft + currDocWidth, currDocTop + currDocHeight],
        ],
        wrapperScrollHeight: baseImageRef.current.clientHeight,
        wrapperWindowHeight: scrollWrapperRef.current.clientHeight,
        activeTimes,
      });
    }
  }, [
    scrollWrapperRef,
    getPlaytimeFromInDocScrollY,
    setDocumentPlayerStateValues,
  ]);

  useEffect(() => {
    if (scrollWrapperRef.current && baseImageRef.current) {
      // setDocumentPlayerStateValues({
      //   standby: true,
      // });
      // scrollWrapperRef.current.scrollTop = 0; //reset scrollWrapper scrollY
      // setDocumentPlayerStateValues({
      //   baseImgSrc: props.documentBaseImageSrc,
      //   documentOnFocusArea: getZeroBbox(), //reset inDocFocusedScrollY
      //   wrapperScrollHeight: baseImageRef.current.clientHeight,
      //   wrapperWindowHeight: scrollWrapperRef.current.clientHeight,
      // });
    }
  }, [
    props.documentBaseImageSrc,
    scrollWrapperRef,
    baseImageRef,
    setDocumentPlayerStateValues,
  ]);

  /**
   * DocPlayer state updation hooks
   * 1. Get new inVidScrollY from currentTime
   * 2. Set inVidScrollY in ref and documentPlayerState
   * 3. Set scrollWrapper scrollY when flg is OK
   */
  useEffect(() => {
    if (baseImageRef.current && scrollWrapperRef.current) {
      const activeTlSection = getActiveTlSectionFromPlaytime(
        currentTime,
        baseImageRef.current.clientHeight
      );

      if (!activeTlSection) {
        setDocumentPlayerStateValues({ standby: false });
        return;
      }

      const videoOnFocusArea = activeTlSection.invidFocusedArea;

      // setCurrTlSecId(activeTlSection.id);
      setDocumentPlayerStateValues({ videoOnFocusArea, standby: true });

      if (!playerActive && !animateEffectActive.current) {
        const [r_areaWidth] = cvtToWHArray(activeTlSection.invidFocusedArea);

        const zoomRate = r_areaWidth > 0 ? 1 / r_areaWidth : 1.0; // d系 -> vf系 変換係数

        const currVideoWidth = scrollWrapperRef.current.clientWidth;
        const currContentWidth = baseImageRef.current.clientWidth;
        const currContentHeight = baseImageRef.current.clientHeight;

        const [r_top, r_left, r_width, r_height] = cvtToTLWHArray(
          activeTlSection.invidFocusedArea
        );

        baseImageRef.current.width = currVideoWidth * zoomRate;
        scrollWrapperRef.current.scrollTop = currContentHeight * r_top;
        scrollWrapperRef.current.scrollLeft = currContentWidth * r_left;

        if (guideAreaWrapperRef.current) {
          guideAreaWrapperRef.current.style.width =
            baseImageRef.current.width + "px";
          guideAreaWrapperRef.current.style.height =
            baseImageRef.current.height + "px";

          setGuideAreaStyles({
            top: r_top * currContentHeight + "px",
            left: r_left * currContentWidth + "px",
            width: r_width * currContentWidth + "px",
            height: r_height * currContentHeight + "px",
          });
        }
      }

      // (additional)4. Update activity states
      props.enableInvidActivitiesReenactment &&
        updateAcitvityState(currentTime);
    }
  }, [currentTime, getActiveTlSectionFromPlaytime]);

  /**
   * DocPlayer animation hooks
   * Set Animations on player unactivated.
   */
  // useEffect(() => {
  //   (() => {
  //     // 0. Don't do anything when disabled flg is activated
  //     if (props.disableUnactiveAnimation) {
  //       return;
  //     }

  //     // 1. Activation of animationEffectActive flg (animation standby flg)
  //     if (playerActive) {
  //       if (!animateEffectActive.current) {
  //         animateEffectActive.current = true; // Activate animation standby flg
  //       }

  //       return;
  //     }

  //     // 2. Do not execute anything when components are null or animation standby flg is unactivated
  //     if (
  //       !scrollWrapperRef.current ||
  //       !baseImageRef.current ||
  //       !animateEffectActive.current
  //     )
  //       return;

  //     // Start on unactivated animation when documentPlayerState.active changes to "false"
  //     if (!animating.current) {
  //       const newScrollY =
  //         getOnfocusAreaFromPlaytime(
  //           currentTime,
  //           baseImageRef.current.clientHeight
  //         )[0][1] * baseImageRef.current.clientHeight;
  //       const scrollWrapper = scrollWrapperRef.current as HTMLDivElement;

  //       //animation effectがonのとき
  //       const nowScrollY = scrollWrapper.scrollTop;
  //       let i = 0;
  //       const animation_sec = 0.5;

  //       const times = Math.round(animation_sec * 60);
  //       const delta = (newScrollY - nowScrollY) / times;

  //       const updateAnimation = () => {
  //         scrollWrapper.scrollTop += delta;
  //         i++;

  //         if (i < times) {
  //           window.requestAnimationFrame(updateAnimation);
  //         } else {
  //           animateEffectActive.current = false;
  //           animating.current = false;
  //         }
  //       };
  //       animating.current = true;
  //       updateAnimation();
  //     }
  //   })();
  // }, [
  //   currentTime,
  //   timeline,
  //   getScrollYFromPlaytime,
  //   scrollWrapperRef,
  //   baseImageRef,
  // ]);

  return (
    <div
      id="document_viewer_wrapper"
      className={`w-full h-full original-player-container bg-white`}
      onClick={() => {
        props.enableDispatchVideoElementClickEvent && videoElement.click();
      }}
      onWheel={() => {
        if (!playerActive) {
          setDocumentPlayerStateValues({ active: true });
        }
      }}
    >
      <div id="document_viewer_container" className="relative w-full h-full">
        <div
          id={playerActive ? props.scrollWrapperId : ""}
          className={`relative mx-auto overflow-scroll scrollbar-hidden z-0 w-full h-full`}
          ref={scrollWrapperRef}
          // style={{
          //   width: `${props.scrollWrapperWidth_pct}%`,
          //   height: `${props.scrollWrapperHeight_pct}%`,
          //   transform: `scale(${document})`,
          // }}
          onScroll={() => {
            updateDocumentState();
          }}
        >
          <img
            className="select-none max-w-none"
            src={props.documentBaseImageSrc}
            ref={baseImageRef}
          />
          <div
            className="absolute top-0 left-0 w-full h-full"
            ref={guideAreaWrapperRef}
          >
            <OnDocumentGuideArea
              {...guideAreaStyles}
              docViewerWidth={scrollWrapperRef.current?.clientWidth ?? 0}
              docViewerHeight={scrollWrapperRef.current?.clientHeight ?? 0}
              // height={baseImageRef.current?.clientHeight ?? 0}
              // active={!props?.enableCombinedView}
              active={true}
            ></OnDocumentGuideArea>
          </div>
          {/* <div
            id="activity_assets_layer"
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full"
            style={{
              width:
                (100 * getAssetsMetadata().video.width) /
                  getAssetsMetadata().document.width +
                "%",
            }}
          >
            {props.enableInvidActivitiesReenactment &&
              getActivityAssets().map((v) => {
                return (
                  <img
                    className="absolute"
                    src={v[2]}
                    style={{
                      top: v[1][0][0] * 100 + "%",
                      left: v[1][0][1] * 100 + "%",
                      width: (v[1][1][1] - v[1][0][1]) * 100 + "%",
                      display: currentTime >= v[0] ? "block" : "none",
                    }}
                  />
                );
              })}
          </div> */}
        </div>
      </div>
    </div>
  );
}
