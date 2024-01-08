import { useState, useEffect, useCallback, useRef } from "react";

const useVideoSeekbar = <
  SeekbarWrapperElement extends HTMLElement = HTMLDivElement,
  SeekbarDraggerElement extends HTMLElement = HTMLDivElement
>(
  videoElementRef: React.RefObject<HTMLVideoElement> | null,
  seekbarContainerRef: React.RefObject<SeekbarWrapperElement | null>,
  draggerRef: React.RefObject<SeekbarDraggerElement | null>,
  currentTime: number,
  liveModeEnabled = false,
  onHandleSetDocumentPlayerActive?: (v: boolean) => void
) => {
  const videoElement = videoElementRef?.current;
  const isDragging = useRef(false);
  const latestCurrentTime = useRef(0);

  const [draggerLeft, setDraggerLeft] = useState(0);

  const [previewState, setPreviewState] = useState({
    currentTime_sec: 0,
    containerLeft: 0,
    imgSrc: "",
  });
  const [previewVisibility, setPreviewVisibility] = useState(false);

  const _getSeekbarWrapperRects = useCallback(() => {
    if (!seekbarContainerRef.current) {
      throw new Error("E_NO_SEEKBAR_REF");
    }

    return seekbarContainerRef.current.getBoundingClientRect();
  }, [seekbarContainerRef]);

  const _getNewCurrentTimeFromDraggerLeft = useCallback(
    (newDraggerLeft: number) => {
      if (!videoElement) {
        return 1000;
      }
      const seekbarRect = _getSeekbarWrapperRects();

      // console.log(newDraggerLeft, seekbarRect.width, videoElement.duration);
      const rate = newDraggerLeft / seekbarRect.width;

      return liveModeEnabled
        ? Math.round(rate * latestCurrentTime.current)
        : Math.round(rate * videoElement.duration);
    },
    [_getSeekbarWrapperRects, liveModeEnabled, videoElement]
  );

  const _getDraggerLeft = useCallback(
    (nowMouseClientX: number): number => {
      if (!seekbarContainerRef.current) {
        throw new Error("E_NO_SEEKBAR_REF");
      }

      const seekbarRect = _getSeekbarWrapperRects();

      // MouseLeftの数値に基づいて、新たなDraggerLeftの値を計算
      const newDraggerLeft = nowMouseClientX - seekbarRect.x;

      // 算出されたDraggerLeftの値がシークバーの左端よりも左だった場合
      // シークバーの左端を返す
      if (newDraggerLeft <= 0) {
        return 0;
      }

      // 算出されたDraggerLeftの値がシークバーの右端よりも右だった場合
      // シークバーの右端を返す
      if (newDraggerLeft > seekbarRect.width) {
        return seekbarRect.width;
      }

      // 算出されたDraggerLeftの値が適切だった場合、そのまま値を返す
      return newDraggerLeft;
    },
    [_getSeekbarWrapperRects, seekbarContainerRef]
  );

  /**
   * Draggerのドラッグ操作終了時の処理
   *
   * 1. DraggerLeftの値を更新する
   * 2. VideoElementのCurrentTimeの値を更新する
   * 3. DraggableStateとonMouseDownClientXをリセットする
   *
   * @returns {void}
   */
  const _setCurrentTimeFromClientX = useCallback(
    (clientX: number) => {
      if (!videoElement) return;

      // console.log("dragging end: " + e.clientX);
      const newDraggerLeft = _getDraggerLeft(clientX);

      //CurrentTime更新
      const newCurrentTime = _getNewCurrentTimeFromDraggerLeft(newDraggerLeft);

      if (!Number.isNaN(newCurrentTime)) {
        setDraggerLeft(newDraggerLeft);
        videoElement.currentTime = newCurrentTime;
      }
    },
    [videoElement, _getNewCurrentTimeFromDraggerLeft, _getDraggerLeft]
  );

  const _setIsDragging = useCallback(
    (value: boolean) => {
      isDragging.current = value;

      /** Make seekbar and dragger larger when dragging */
      // setSeekbarHeight(value ? seekbarHeight * 2 : seekbarHeight);
      // setDraggerRadius(value ? draggerRadius * 1.5 : draggerRadius);

      if (onHandleSetDocumentPlayerActive && value) {
        onHandleSetDocumentPlayerActive(false);
      }
    },
    [onHandleSetDocumentPlayerActive]
  );

  const _showPreview = useCallback(
    (clientX: number) => {
      setPreviewVisibility(true);

      const hoverLeftXInSeekbarRect = _getDraggerLeft(clientX);

      const previewCurrentTime_sec = _getNewCurrentTimeFromDraggerLeft(
        hoverLeftXInSeekbarRect
      );

      setPreviewState((b) => ({
        ...b,
        currentTime_sec: liveModeEnabled
          ? previewCurrentTime_sec - latestCurrentTime.current
          : previewCurrentTime_sec,
        containerLeft: hoverLeftXInSeekbarRect,
        // imgSrc: getPreviewImagesFromSec(previewCurrentTime_sec),
      }));
    },
    [liveModeEnabled, _getDraggerLeft, _getNewCurrentTimeFromDraggerLeft]
  );

  const _hidePreview = useCallback(() => {
    setPreviewVisibility(() => false);
  }, [setPreviewVisibility]);

  /**
   * Draggerのドラッグに合わせ、DraggerLeftの値を更新する
   */
  const _moveDragger = useCallback(
    (clientX: number) => {
      //なぜかmouseDownのタイミングでnullが入ってくることがあるので，その場合は処理を中断
      if (!clientX) return;

      const newDraggerLeft = _getDraggerLeft(clientX);
      newDraggerLeft !== null && setDraggerLeft(newDraggerLeft);
    },
    [_getDraggerLeft]
  );

  /**
   * currentTimeのontimeupdateに合わせてDraggerLeftを更新
   */
  useEffect(() => {
    //ドラッグ中であれば処理を行わない
    if (isDragging.current || !videoElement) return;

    const seekbarRect = _getSeekbarWrapperRects();

    if (latestCurrentTime.current < videoElement.currentTime) {
      latestCurrentTime.current = videoElement.currentTime;
    }

    const denominator = liveModeEnabled
      ? latestCurrentTime.current
      : videoElement.duration;

    const parsedDenominator = denominator > 1 ? denominator : 1;

    const newDraggerLeft = Math.floor(
      seekbarRect.width * (currentTime / parsedDenominator)
    );

    //currentTimeから、新たなDraggerLeftの位置を計算・設定
    setDraggerLeft(() => newDraggerLeft);
    // _updateIsReviewingFlg(newDraggerLeft);
  }, [
    currentTime,
    _getSeekbarWrapperRects,
    setDraggerLeft,
    isDragging,
    liveModeEnabled,
    videoElement,
  ]);

  const _handleLeaveDragger = useCallback(
    (clientX: number) => {
      _setCurrentTimeFromClientX(clientX);
      _setIsDragging(false);
      _hidePreview();
    },
    [_setCurrentTimeFromClientX, _setIsDragging, _hidePreview]
  ); // mouseup, touchend

  const _handleGrabDragger = useCallback(
    (clientX: number) => {
      _moveDragger(clientX);
      _setIsDragging(true);
    },
    [_moveDragger, _setIsDragging]
  ); // mousedown, touchstart

  const _handleMoveDragger = useCallback(
    (clientX: number) => {
      _showPreview(clientX);
      _moveDragger(clientX);
      // _setCurrentTimeFromClientX(clientX); // real time preview with scrubbing (temporarily off due to performance issues)
    },
    [
      _showPreview,
      _moveDragger,
      // _setCurrentTimeFromClientX
    ]
  ); // mousemove, touchmove

  const seekbarWrapperProps = {
    // タッチ操作によるドラッグのスタート
    onTouchStart: (e: React.TouchEvent) => {
      _handleGrabDragger(e.touches[0].clientX);
    },

    // マウスによるドラッグのスタート
    onMouseDown: (e: React.MouseEvent) => {
      _handleGrabDragger(e.clientX);
    },

    // マウスのホバーによるプレビュー表示ON
    onMouseMove: (e: React.MouseEvent) => {
      _showPreview(e.clientX);
    },

    // マウスのホバーによるプレビュー表示OFF
    onMouseLeave: () => {
      _hidePreview();
    },
  };
  /**
   * draggerMove, draggerLeave関連のイベントのハンドリングは，
   * シークバーコンポーネント外の領域でも操作可能である必要があるため，
   * documentオブジェクトに対してイベントをアタッチする
   */
  useEffect(() => {
    const handleDocumentMouseMove = (e: globalThis.MouseEvent) => {
      isDragging.current && _handleMoveDragger(e.clientX);
    };
    const handleDocumentTouchMove = (e: globalThis.TouchEvent) => {
      isDragging.current && _handleMoveDragger(e.changedTouches[0].clientX);
    };

    const handleDocumentMouseUp = (e: globalThis.MouseEvent) => {
      isDragging.current && _handleLeaveDragger(e.clientX);
    };
    const handleDocumentTouchEnd = (e: globalThis.TouchEvent) => {
      isDragging.current && _handleLeaveDragger(e.changedTouches[0].clientX);
    };

    // マウスによるドラッグ操作中の処理
    document.addEventListener("mousemove", handleDocumentMouseMove);

    // タッチによるドラッグ操作中の処理
    document.addEventListener("touchmove", handleDocumentTouchMove);

    // マウスによるドラッグ操作終了
    document.addEventListener("mouseup", handleDocumentMouseUp);

    // タッチによるドラッグ操作終了
    document.addEventListener("touchend", handleDocumentTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("touchmove", handleDocumentTouchMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("touchend", handleDocumentTouchEnd);
    };
  }, [_handleMoveDragger, _handleLeaveDragger]);

  return {
    seekbarContainerRef,
    draggerRef,
    draggerLeft,
    previewVisibility,
    previewImgSrc: previewState.imgSrc,
    currentPreviewTime_sec: previewState.currentTime_sec,
    previewContainerLeft: previewState.containerLeft,
    seekbarWrapperProps,
  };
};

export default useVideoSeekbar;
