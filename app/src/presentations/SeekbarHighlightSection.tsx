import React from "react";

export const SeekbarHighlightSection: React.FC<{
  leftPct: number;
  widthPct: number;
  visible: boolean;
  opacity: number;
  handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  color?: string;
}> = ({ leftPct, widthPct, visible, opacity, handleClick, color }) => (
  <div
    className={`
        absolute top-0 translate-y-[-10%] h-[125%] 
        hover:h-[200%] hover:translate-y-[-30%] 
      `}
    style={{
      left: leftPct + "%",
      width: widthPct + "%",
      background: color ?? "yellow",
      visibility: visible ? "visible" : "hidden",
      opacity: opacity,
      translate: `translateX(-50%)`,
    }}
    onClick={handleClick}
  ></div>
);
