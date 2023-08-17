import React, { PropsWithChildren } from "react";

/**
 * 呼び出し元の親コンポーネントに関する条件：
 * 1. 幅・高さがシークバーのラッパーコンポーネントと同一である
 * 2. スタイリングでposition: relativeを指定している
 */
export default function SeekbarHighlightContainer(
  props: PropsWithChildren<{
    videoElement: HTMLVideoElement;
    documentActiveTimes: [number, number][];
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
              time={v}
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

function SeekbarHighlightArea(
  props: PropsWithChildren<{
    left_pct: number;
    width_pct: number;
    visible: boolean;
    time: [number, number];
    // handleSetVideoCurrentTime: () => void;
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
        left: props.left_pct + "%",
        width: props.width_pct + "%",
        background: props.color ?? "yellow",
        visibility: props.visible ? "visible" : "hidden",
        translate: `translateX(${type === "point" ? "-50%" : "0"})`,
      }}
      // onMouseDown={() => {
      // Make documentPlayer hidden
      // props.onHandleSetDocumentPlayerActive(false);
      // playerUnactive時のアニメーション用のオプション設定
      // スライド資料の時のみ，クリックすると特定のスライドの箇所が離散的に選択されるので，
      // プレイヤー消去時アニメーションのスライド先の到着点を
      //（top + bottom） / 2 (開始地点と終了地点の平均値)に指定
      // ※開始地点のみを判定基準にすると，ひとつ前のスライドがマッチングされる場合があるので
      // playerExtension.playerUnactiveScrollToはslideプレイヤーのみに使用する．
      // playerExtension.playerUnactiveScrollTo.current =
      //   (props.time[0] + props.time[1]) / 2;
      //
      // props.handleSetVideoCurrentTime(props.time[0]);
      // e.preventDefault();
      // e.stopPropagation();
      //
      // if (type === "point") {
      //   props.handleSetVideoCurrentTime(props.time[0]);
      //   e.preventDefault();
      //   e.stopPropagation();
      // } else {
      //   props.handleSetVideoCurrentTime((props.time[0] + props.time[1]) / 2);
      //   e.preventDefault();
      //   e.stopPropagation();
      // }
      // }}
    ></div>
  );
}
