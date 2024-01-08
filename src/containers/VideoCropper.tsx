import React, { CSSProperties, useCallback, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { usePointerDrag } from "@/hooks/usePointerDrag";
import {
  userCroppedAreaAtom,
  videoCropperActiveAtom,
  videoElementRefAtom,
} from "@/providers/jotai/swapVidPlayer";
import { clamp } from "@/utils/validate";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export const VideoCropper: React.FC<{
  zIndex?: number;
}> = ({ zIndex }) => {
  const [videoCropperActive, setVideoCropperActive] = useAtom(
    videoCropperActiveAtom
  );

  const [dragAreaRect, setDragAreaRect] = useState<null | DragAreaRect>(null);
  const wrapperElementRef = useRef<HTMLDivElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useAtomValue(videoElementRefAtom);

  const setUserCroppedArea = useSetAtom(userCroppedAreaAtom);

  const handleCloseComponent = useCallback(() => {
    setVideoCropperActive(false);
    setDragAreaRect(null);
  }, [setVideoCropperActive, setDragAreaRect]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setDragAreaRect((_) => ({
        top: e.clientY,
        left: e.clientX,
        width: 0,
        height: 0,
        axisXReverse: false,
        axisYReverse: false,
        active: false,
      }));
    },
    [setDragAreaRect]
  );

  const handlePointerMove = useCallback(
    (
      e: React.PointerEvent,
      _isDragging: boolean,
      dragStartPoint: { left: number; top: number }
    ) => {
      if (!videoElementRef?.current || !wrapperElementRef.current) return;

      const axisXReverse = e.clientX < dragStartPoint.left;
      const axisYReverse = e.clientY < dragStartPoint.top;

      const wrapperWidth = wrapperElementRef.current.clientWidth;
      const wrapperHeight = wrapperElementRef.current.clientHeight;

      const anchorX = axisXReverse
        ? {
            right: wrapperWidth - dragStartPoint.left,
            axisXReverse,
          }
        : {
            left: dragStartPoint.left,
            axisXReverse,
          };
      const anchorY = axisYReverse
        ? {
            bottom: wrapperHeight - dragStartPoint.top,
            axisYReverse,
          }
        : {
            top: dragStartPoint.top,
            axisYReverse,
          };

      const width = Math.abs(e.clientX - dragStartPoint.left);
      const height = Math.abs(e.clientY - dragStartPoint.top);

      const newDragAreaRect = {
        ...anchorX,
        ...anchorY,
        width,
        height,
        active: true,
      };

      setDragAreaRect(newDragAreaRect);
    },
    [videoElementRef, setDragAreaRect]
  );

  const { handlers } = usePointerDrag({
    onPointerMoveHook: handlePointerMove,
    onPointerDownHook: handlePointerDown,
  });

  const handleResetDragAreaRect = useCallback(() => {
    setDragAreaRect(null);
  }, [setDragAreaRect]);

  const handleSubmitDragArea = useCallback(() => {
    if (
      !dragAreaRect ||
      !wrapperElementRef.current ||
      !videoElementRef?.current
    )
      return;

    /**
     * Define "bottom" and "right" as the same as CSS "bottom" and "right".
     */

    const wrapperRect = wrapperElementRef.current.getBoundingClientRect();

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

    const videoRect = videoElementRef.current.getBoundingClientRect();

    const videoScaleLeft = clamp(0, raw.left - videoRect.left, videoRect.width);
    const videoScaleTop = clamp(0, raw.top - videoRect.top, videoRect.height);
    const videoScaleRight = clamp(
      0,
      raw.right - videoRect.left,
      videoRect.width
    );
    const videoScaleBottom = clamp(
      0,
      raw.bottom - videoRect.top,
      videoRect.height
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

    setUserCroppedArea({
      raw,
      videoScale,
    });

    handleCloseComponent();
  }, [dragAreaRect, videoElementRef, setUserCroppedArea, handleCloseComponent]);

  const handleClickCloseButton = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleCloseComponent();
    },
    [handleCloseComponent]
  );

  const handleClickSubmitButton = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dragAreaRect?.active ? handleSubmitDragArea() : handleResetDragAreaRect();
    },
    [dragAreaRect, handleSubmitDragArea, handleResetDragAreaRect]
  );

  if (!videoElementRef?.current) return <></>;

  const submitButtonStyles: CSSProperties = {
    userSelect: dragAreaRect?.active ? "auto" : "none",
    cursor: dragAreaRect?.active ? "pointer" : "auto",
    // background: dragAreaRect?.active ? "#3b82f6" : "#475569",
    minWidth: 250,
    left:
      wrapperElementRef.current && dragAreaRef.current
        ? dragAreaRef.current.offsetLeft + dragAreaRef.current.clientWidth / 2
        : 0,
    bottom:
      wrapperElementRef.current && dragAreaRef.current
        ? wrapperElementRef.current.clientHeight -
          dragAreaRef.current.getBoundingClientRect().bottom -
          75
        : 0,
  };

  return (
    <div
      id="swapvid_desktop_video_cropper"
      className="fixed top-0 left-0 w-screen h-screen bg-black-transparent-01"
      ref={wrapperElementRef}
      style={{
        zIndex: zIndex ?? "auto",
        visibility: videoCropperActive ? "visible" : "hidden",
      }}
      {...handlers}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xl text-white select-none">
        <b>Video Cropper Mode</b> : Please drag document area in the video.
      </div>

      <div
        className="absolute bg-[rgba(256,256,256,0.35)] border-4 border-white border-dashed select-none"
        style={{
          visibility: dragAreaRect?.active ? "visible" : "hidden",
          ...dragAreaRect,
        }}
        ref={dragAreaRef}
      ></div>

      <button
        className="absolute right-4 top-4 flex-xyc gap-2 rounded-full bg-teal-600 text-white w-14 h-14"
        onClick={handleClickCloseButton}
      >
        <FontAwesomeIcon icon={faClose} className="font-bold text-4xl" />
      </button>

      {dragAreaRect?.active && (
        <button
          className={`absolute left-1/2 -translate-x-1/2 px-8 py-2 bg-teal-600 hover:bg-teal-700 text-center text-xl font-bold rounded-full text-white`}
          onPointerDown={handleClickSubmitButton}
          style={submitButtonStyles}
        >
          Crop the area to render document
        </button>
      )}
    </div>
  );
};
