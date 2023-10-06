import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, PropsWithChildren } from "react";

export const ScrollToCurrentShownAreaButton = (props: {
  className: string;
  style: React.CSSProperties | undefined;
  scrollTargetElement: HTMLElement | null;
  currentScrollY: number;
}) => (
  <button
    className={`p-2 w-[275px] bg-slate-600 text-lg text-white rounded-full ${props.className}`}
    style={props.style}
    onClick={(e) => {
      if (props.scrollTargetElement) {
        props.scrollTargetElement.scrollTo(0, props.currentScrollY);
      }
    }}
  >
    <FontAwesomeIcon className="mr-2" icon={faReply}></FontAwesomeIcon>
    再生箇所までスクロール
  </button>
);

export const Slate600Button = (
  props: PropsWithChildren<{
    onHandleClick: () => void;
    disabled: boolean;
  }>
) => (
  <button
    className="bg-slate-600 text-white text-xl rounded-full p-2 shadow-md disabled:bg-slate-200 hover:bg-slate-400"
    onClick={props.onHandleClick}
    disabled={props.disabled}
  >
    {props.children}
  </button>
);

export const OnPlayerPositionNavButton = (props: {
  buttonStyles: CSSProperties;
  onHandleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => <></>;
// <button
//   className="absolute left-[10px] flex px-4 py-2 z-10 left-2 rounded-full text-white text-center font-bold text-xl bg-red-600 cursor-pointer border-[3px] border-white"
//   style={{
//     ...props.buttonStyles,
//   }}
//   onClick={props.onHandleClick}
// >
//   <span className="text-white">
//     {props.buttonStyles.top !== undefined
//       ? "▲"
//       : props.buttonStyles.bottom !== undefined
//       ? "▼"
//       : ""}
//   </span>
//   <p className="text-xl z-0 ml-2">再生中の動画内でのフォーカス部分</p>
// </button>
