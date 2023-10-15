import React, { useCallback, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  ReactZoomPanPinchState,
} from "react-zoom-pan-pinch";
import { useSetDocumentPlayerStateCtx } from "./useContextConsumer";

function __useDocumentTransform(
  playerActive: boolean,
  activatePlayer: () => void
) {
  const { setDocumentPlayerStateValues } = useSetDocumentPlayerStateCtx();

  const transformScaleDefault = 1;
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [transformState, setTransformState] =
    useState<null | ReactZoomPanPinchState>(null);
  const prevPointerPos = useRef<null | [number, number]>(null);
  const prevZoomPosCache = useRef<[number, number] | null>(null);
  const momentumScrollingInfo = useRef<
    | {
        prevPos: [number, number];
        vector: [number, number];
        active: true;
      }
    | {
        prevPos: [];
        vector: [];
        active: false;
      }
  >({
    prevPos: [],
    vector: [],
    active: false,
  });
  const momentumScrollingSmoothingSteps = 0.1;
  const resetTransformFlg = useRef(false);

  const handleResetTransform = useCallback(() => {
    if (transformComponentRef.current) {
      resetTransformFlg.current = true;
      const utils = transformComponentRef.current;
      utils.resetTransform();
      momentumScrollingInfo.current = {
        active: false,
        prevPos: [],
        vector: [],
      };
      setTransformState(null);
    }
  }, [transformComponentRef]);

  const handleZoomStart = useCallback(
    (e: ReactZoomPanPinchRef) => {
      resetTransformFlg.current = false;
      setTransformState(e.state);

      // activatePlayer(); // Cause a bug (activeScrollTl becomes null in activatePlayer(), but Idk why)
      !playerActive && setDocumentPlayerStateValues({ active: true });
    },
    [setTransformState, setDocumentPlayerStateValues, playerActive]
  );

  const handleZoomStop = useCallback(
    (e: ReactZoomPanPinchRef) => {
      if (resetTransformFlg.current) return;

      setTransformState(e.state);
      prevZoomPosCache.current = [e.state.positionX, e.state.positionY];
    },
    [setTransformState]
  );

  const handleSetTransform = useCallback(
    (newPositionX: number, newPositionY: number, currentScale: number) => {
      console.log(
        "settingPosition (x,y,scale)",
        newPositionX,
        newPositionY,
        currentScale
      );
      if (
        transformComponentRef.current &&
        momentumScrollingInfo.current.active
      ) {
        transformComponentRef.current.setTransform(
          newPositionX,
          newPositionY,
          currentScale,
          0
        );

        // prevPointerPos.current = [
        //   transformComponentRef.current.state.positionX,
        //   transformComponentRef.current.state.positionY,
        // ];

        setTransformState((b) => ({
          positionX: newPositionX,
          positionY: newPositionY,
          scale: currentScale,
          previousScale: b?.previousScale ?? 0,
        }));
      }
    },
    [prevPointerPos, transformComponentRef, setTransformState]
  );

  const momentumScrollingAnimationCallback = useCallback(() => {
    const msInfo = momentumScrollingInfo.current;

    if (!msInfo.active || !transformState) {
      return;
    }

    const newPosition: [number, number] = [
      msInfo.prevPos[0] + msInfo.vector[0],
      msInfo.prevPos[1] + msInfo.vector[1],
    ];

    console.log(
      // "momentumScrolling animation callback",
      // msInfo.vector,
      prevZoomPosCache.current,
      momentumScrollingInfo.current.prevPos,
      newPosition
    );

    handleSetTransform(
      // transformState.positionX - msInfo.vector[0],
      // transformState.positionY - msInfo.vector[1],
      ...newPosition,
      transformState.scale
    );

    prevZoomPosCache.current = [
      msInfo.prevPos[0] - msInfo.vector[0],
      msInfo.prevPos[1] - msInfo.vector[1],
    ];

    if (
      momentumScrollingInfo.current.active &&
      (msInfo.vector[0] > 1 || msInfo.vector[1] > 1)
    ) {
      const mul = 1 - momentumScrollingSmoothingSteps;
      momentumScrollingInfo.current = {
        prevPos: newPosition,
        vector: [msInfo.vector[0] * mul, msInfo.vector[1] * mul],
        active: true,
      };

      requestAnimationFrame(momentumScrollingAnimationCallback);
    }
  }, [
    transformState,
    momentumScrollingInfo,
    prevZoomPosCache,
    handleSetTransform,
  ]);

  const handleWrapperOnWheel = useCallback(
    (e: React.WheelEvent) => {
      // [PC] Enable free scrolling when zoom mode is enabled
      if (transformState) {
        handleSetTransform(
          transformState.positionX - e.deltaX,
          transformState.positionY - e.deltaY,
          transformState.scale
        );
      }

      if (!playerActive) {
        const onClickNode = e.nativeEvent.composedPath()[0] as HTMLElement;
        const isTextClicked =
          onClickNode.nodeName === "SPAN" && !!onClickNode.innerText;
        isTextClicked && activatePlayer();
      }

      activatePlayer();
    },
    [transformState, transformComponentRef, setTransformState, activatePlayer]
  );

  const handleWrapperOnTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Initialize momentum scrolling info
      console.log("Initializing momeutumScrollingInfo");
      momentumScrollingInfo.current = {
        prevPos: [],
        vector: [],
        active: false,
      };

      // Initialize previous transform positions
      // prevZoomPosCache.current = null;

      if (e.touches.length === 1) {
        prevPointerPos.current = [e.touches[0].clientX, e.touches[0].clientY];
      }

      activatePlayer();
    },
    [playerActive, transformState, prevPointerPos, activatePlayer]
  );

  const handleWrapperOnTouchMove = useCallback(
    (e: React.TouchEvent) => {
      // Update cached pointer event

      if (playerActive && transformState && e.touches.length === 1) {
        // [Touch Device] Enable free scrolling when zoom mode is enabled, if document is swiped by a single finger
        const pt: [number, number] = [
          e.touches[0].clientX,
          e.touches[0].clientY,
        ];

        if (
          prevPointerPos.current &&
          // transformState &&
          prevZoomPosCache.current
        ) {
          const delta: [number, number] = [
            pt[0] - prevPointerPos.current[0],
            pt[1] - prevPointerPos.current[1],
          ];

          const newPosition: [number, number] = [
            prevZoomPosCache.current[0] + delta[0],
            prevZoomPosCache.current[1] + delta[1],
          ];
          prevZoomPosCache.current = [...newPosition];

          handleSetTransform(...newPosition, transformState.scale);

          momentumScrollingInfo.current = {
            prevPos: [...newPosition],
            vector: delta,
            active: true, // Set momentum scrolling flg
          };
        }

        prevPointerPos.current = pt;
      }
    },
    [prevPointerPos.current, transformState, handleSetTransform]
  );

  const handleWrapperOnTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      requestAnimationFrame(momentumScrollingAnimationCallback);
    },
    [transformComponentRef, momentumScrollingAnimationCallback]
  );

  return {
    handleResetTransform,
    handleSetTransform,
    handleWrapperOnTouchStart,
    handleWrapperOnTouchMove,
    handleWrapperOnTouchEnd,
    handleWrapperOnWheel,
    handleZoomStart,
    handleZoomStop,
  };
}
