import { PropsWithChildren } from "react";

const SeekbarHighlightArea = (
  props: PropsWithChildren<{
    left_pct: number;
    width_pct: number;
    visible: boolean;
    time: [number, number];
    opacity: number;
    // handleSetVideoCurrentTime: () => void;
    onHandleSetDocumentPlayerActive: (v: boolean) => void;
    color?: string;
  }>
) => (
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
      opacity: props.opacity,
      translate: `translateX(${
        props.time[1] === props.time[0] ? "-50%" : "0"
      })`,
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

export default SeekbarHighlightArea;
