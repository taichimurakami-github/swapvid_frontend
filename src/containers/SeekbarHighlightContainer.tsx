import React, { PropsWithChildren } from "react";

/**
 * 呼び出し元の親コンポーネントに関する条件：
 * 1. 幅・高さがシークバーのラッパーコンポーネントと同一である
 * 2. スタイリングでposition: relativeを指定している
 */
export default function SeekbarHighlightContainer(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    documentActiveTimes: [number, number, number][];
    documentPlayerActive: boolean;
    onHandleSetDocumentPlayerActive: (v: boolean) => void;
    disableViewportEffectOnSeekbarHighlight?: boolean;
    disableSmoothingSeekbarHighlightGap?: boolean;
    samplingRateSec?: number;
  }>
) {
  const videoElement = props.videoElement;

  const SAMPLING_RATE_SEC = props.samplingRateSec ?? 1;
  const VIEWPORT_INCLUSION_THRESHOLD = 0.5;

  const t_max = videoElement.duration;

  // Length of the gap between highlight areas as a percentage of the width of the parent component.
  const gapPct = !props.disableSmoothingSeekbarHighlightGap
    ? (100 * SAMPLING_RATE_SEC) / t_max
    : 0;

  return (
    <>
      {videoElement &&
        props.documentActiveTimes.map(
          (v /** v = [t_start, t_end, opacity] */) => {
            /**
             * 1. Calculate the width of the highlight area
             *    as a percentage of the width of the parent component.
             */
            const sectionTimeDelta = v[1] - v[0];
            const widthPct = 100 * (sectionTimeDelta / t_max);

            /**
             * 2. Calculate the distance
             *    from the left edge of the parent component
             *    to the left edge of the section
             *    as a percentage of the total width.
             */
            const leftPct = (100 * v[0]) / t_max;

            /**
             * 3. Determine the opacity value of the highlight area.
             *    If the disableViewportEffectOnSeekbarHighlight flag is set,
             *    the opacity value is forcely set to 1.
             */
            const opacity = !props.disableViewportEffectOnSeekbarHighlight
              ? v[2]
              : v[2] > VIEWPORT_INCLUSION_THRESHOLD
              ? 1
              : 0;

            return (
              <SeekbarHighlightArea
                /**
                 * To avoid the gap between highlight areas,
                 * expand the highlight area by gapPct / 2 from the left and right.
                 *
                 * from:
                 * |  <highlight01>  <highlight02>  | <- SeekBar component
                 *
                 * to:
                 * | < highlight01 >< highlight02 > | <- SeekBar component
                 */
                leftPct={leftPct - gapPct / 2}
                widthPct={widthPct + gapPct}
                visible={props.documentPlayerActive}
                time={[v[0], v[1]]}
                opacity={opacity}
                onHandleSetDocumentPlayerActive={
                  props.onHandleSetDocumentPlayerActive
                }
              ></SeekbarHighlightArea>
            );
          }
        )}
    </>
  );
}

function SeekbarHighlightArea(
  props: PropsWithChildren<{
    leftPct: number;
    widthPct: number;
    visible: boolean;
    time: [number, number];
    opacity: number;
    onHandleSetDocumentPlayerActive: (v: boolean) => void;
    color?: string;
  }>
) {
  // const playerExtension = usePlayerExtensionCtx();
  const type = props.time[1] === props.time[0] ? "point" : "section";
  return (
    <div
      className={`
        absolute top-0 translate-y-[-10%] h-[125%] 
        hover:h-[200%] hover:translate-y-[-30%] 
      `}
      style={{
        left: props.leftPct + "%",
        width: props.widthPct + "%",
        background: props.color ?? "yellow",
        visibility: props.visible ? "visible" : "hidden",
        opacity: props.opacity,
        translate: `translateX(${type === "point" ? "-50%" : "0"})`,
      }}
    ></div>
  );
}
