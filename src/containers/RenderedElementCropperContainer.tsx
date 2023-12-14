import { DOMRectLike } from "@/types/swapvid";
import { useSetVideoCropAreaCtx } from "@hooks/useContextConsumer";
import React, {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";

type DragAreaAnchorX =
  | {
      axisXReverse: true;
      right: number;
    }
  | {
      axisXReverse: false;
      left: number;
    };

type DragAreaAnchorY =
  | {
      axisYReverse: true;
      bottom: number;
    }
  | {
      axisYReverse: false;
      top: number;
    };

/** CSS Rect */
type DragAreaRect = {
  width: number;
  height: number;
  active: boolean;
} & DragAreaAnchorX &
  DragAreaAnchorY;

export default function RenderedElementCropperContainer(
  props: PropsWithChildren<{
    active: boolean;
    videoRef: React.RefObject<HTMLVideoElement>;
    handleComponentActive: (active?: boolean) => void;
    handleSubmitCropArea: (cropArea: {
      raw: DOMRectLike; // Same as DOMRect
      videoScale: DOMRectLike; // Same as DOMRect
    }) => void;
  }>
) {
  const { setVideoCropArea } = useSetVideoCropAreaCtx();

  const [dragAreaRect, setDragAreaRect] = useState<null | DragAreaRect>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const dragStartPoint = useRef<{ left: number; top: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      const startPoint = {
        left: e.clientX,
        top: e.clientY,
      };

      dragStartPoint.current = startPoint;

      setDragAreaRect((b) => ({
        top: startPoint.top,
        left: startPoint.left,
        width: 0,
        height: 0,
        axisXReverse: false,
        axisYReverse: false,
        active: false,
      }));
    },
    [isDragging, setDragAreaRect, dragStartPoint]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = false;
      dragStartPoint.current = null;
    },
    [isDragging, setDragAreaRect]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (
        !isDragging.current ||
        !props.videoRef.current ||
        !dragStartPoint.current ||
        !wrapperRef.current
      )
        return;

      const axisXReverse = e.clientX < dragStartPoint.current.left;
      const axisYReverse = e.clientY < dragStartPoint.current.top;

      const wrapperWidth = wrapperRef.current.clientWidth;
      const wrapperHeight = wrapperRef.current.clientHeight;

      const anchorX = axisXReverse
        ? {
            right: wrapperWidth - dragStartPoint.current.left,
            axisXReverse,
          }
        : {
            left: dragStartPoint.current.left,
            axisXReverse,
          };
      const anchorY = axisYReverse
        ? {
            bottom: wrapperHeight - dragStartPoint.current.top,
            axisYReverse,
          }
        : {
            top: dragStartPoint.current.top,
            axisYReverse,
          };

      const width = Math.abs(e.clientX - dragStartPoint.current.left);
      const height = Math.abs(e.clientY - dragStartPoint.current.top);

      const newDragAreaRect = {
        ...anchorX,
        ...anchorY,
        width,
        height,
        active: true,
      };

      setDragAreaRect(newDragAreaRect);
    },
    [props.videoRef, setDragAreaRect]
  );

  const handleResetDragAreaRect = useCallback(() => {
    setDragAreaRect(null);
  }, [setDragAreaRect]);

  const handleSubmitDragArea = useCallback(() => {
    if (!dragAreaRect || !wrapperRef.current || !props.videoRef.current) return;

    /**
     * Define "bottom" and "right" as the same as CSS "bottom" and "right".
     */

    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    const raw = {
      // Convert CSS "left" to DOMRect "left".
      left: dragAreaRect.axisXReverse
        ? wrapperRect.width - (dragAreaRect.right + dragAreaRect.width)
        : dragAreaRect.left,

      // Convert CSS "top" to DOMRect "top".
      top: dragAreaRect.axisYReverse
        ? wrapperRect.height - (dragAreaRect.bottom + dragAreaRect.height)
        : dragAreaRect.top,
      right: 0,
      bottom: 0,

      width: dragAreaRect.width,
      height: dragAreaRect.height,
    };

    raw.right = raw.left + raw.width;
    raw.bottom = raw.top + raw.height;

    const videoRect = props.videoRef.current.getBoundingClientRect();

    const videoScaleLeft = Math.max(
      0,
      Math.min(raw.left - videoRect.left, videoRect.width)
    );
    const videoScaleTop = Math.max(
      0,
      Math.min(raw.top - videoRect.top, videoRect.height)
    );
    const videoScaleRight = Math.max(
      0,
      Math.min(raw.right - videoRect.left, videoRect.width)
    );
    const videoScaleBottom = Math.max(
      0,
      Math.min(raw.bottom - videoRect.top, videoRect.height)
    );

    const videoScaleWidth = videoScaleRight - videoScaleLeft;
    const videoScaleHeight = videoScaleBottom - videoScaleTop;

    const videoScale = {
      left: videoScaleLeft,
      top: videoScaleTop,
      right: videoScaleRight,
      bottom: videoScaleBottom,
      width: videoScaleWidth,
      height: videoScaleHeight,
    };

    // console.log(
    //   [raw.right - videoRect.left, "<=", videoRect.width],
    //   [raw.bottom - videoRect.top, "<=", videoRect.height]
    // );
    // console.log(raw);
    // console.log(videoScale);

    // props.handleSubmitCropArea({ raw, videoScale });

    setVideoCropArea({ raw, videoScale });
    props.handleComponentActive(false);
  }, [dragAreaRect, wrapperRef, props, setVideoCropArea]);

  if (!props.videoRef.current || !props.active) return <></>;

  const submitButtonStyles: CSSProperties = {
    userSelect: dragAreaRect?.active ? "auto" : "none",
    cursor: dragAreaRect?.active ? "pointer" : "auto",
    // background: dragAreaRect?.active ? "#3b82f6" : "#475569",
    minWidth: 250,
    left:
      wrapperRef.current && dragAreaRef.current
        ? dragAreaRef.current.offsetLeft + dragAreaRef.current.clientWidth / 2
        : 0,
    bottom:
      wrapperRef.current && dragAreaRef.current
        ? wrapperRef.current.clientHeight -
          dragAreaRef.current.getBoundingClientRect().bottom -
          75
        : 0,
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.7)]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      ref={wrapperRef}
    >
      {!dragAreaRect && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          ドラッグしてSequence Analyzerで解析する範囲を選択<br></br>
          ※ビデオ領域以外は無効です．
        </div>
      )}

      <div
        className="bg-[rgba(256,256,256,0.35)] border-4 border-white border-dashed select-none"
        style={{
          position: "absolute",
          visibility: dragAreaRect?.active ? "visible" : "hidden",
          ...dragAreaRect,
        }}
        ref={dragAreaRef}
      ></div>

      <button
        className="absolute right-4 top-4 p-2 rounded-md bg-slate-600 text-white font-bold text-xl"
        onClick={() => {
          props.handleComponentActive(false);
        }}
      >
        切り抜きモードを終了
      </button>

      {dragAreaRect?.active && (
        <button
          className={`absolute left-1/2 -translate-x-1/2 px-8 py-2 bg-blue-400 text-center text-xl font-bold rounded-full text-white`}
          onPointerDown={(e) => {
            e.stopPropagation();

            dragAreaRect?.active
              ? handleSubmitDragArea()
              : handleResetDragAreaRect();
          }}
          style={submitButtonStyles}
        >
          選択範囲を切り抜き
        </button>
      )}
    </div>
  );
}
