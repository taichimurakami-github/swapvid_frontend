import SeekbarHighlightArea from "@/ui/SeekbarHighlightArea";
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
  }>
) {
  const videoElement = props.videoElement;
  const AREA_MIN_WIDTH_PCT = 0.667;

  const t_max = videoElement.duration;
  const dt_min = (t_max * AREA_MIN_WIDTH_PCT) / 100;

  return (
    <>
      {videoElement &&
        props.documentActiveTimes.map((v) => {
          //1. セクション幅をシークバーの幅に対するパーセントの割合として定義する
          //（ただし，最低幅が AREA_MIN_WIDTH_PCTとなる様に補正する）
          const temp_dt = v[1] - v[0];
          const dt = temp_dt > dt_min ? temp_dt : dt_min;
          const width_pct = (100 * dt) / t_max;

          //2. 親コンポーネント左端からの，セクションの左端の距離を総体指定で求める
          const left_pct = (100 * v[0]) / t_max;

          return (
            <SeekbarHighlightArea
              left_pct={left_pct}
              width_pct={width_pct}
              visible={props.documentPlayerActive}
              time={[v[0], v[1]]}
              opacity={v[2]}
              onHandleSetDocumentPlayerActive={
                props.onHandleSetDocumentPlayerActive
              }
              // handleSetVideoCurrentTime={() => {
              // console.log("seekbarHighlight", t);
              // videoElement.currentTime = t;
              // props.onHandleSetDocumentPlayerActive(false);
              // }}
            ></SeekbarHighlightArea>
          );
        })}
    </>
  );
}
