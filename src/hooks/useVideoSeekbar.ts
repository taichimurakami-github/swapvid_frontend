import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

const useVideoSeekbar = (
  videoElement: HTMLVideoElement,
  currentTime: number,
  liveModeEnabled = false,
  seekbar_height = 10,
  dragger_radius = 20,

  onHandleSetDocumentPlayerActive?: (v: boolean) => void
) => {
  const seekbarWrapperRef = useRef(null);
  const draggerRef = useRef(null);
  const isDragging = useRef(false);
  const latestCurrentTime = useRef(0);

  const [draggerLeft, setDraggerLeft] = useState(0);
  const [seekbarHeight] = useState(seekbar_height);
  const [draggerRadius] = useState(dragger_radius);

  const [previewState, setPreviewState] = useState({
    currentTime_sec: 0,
    containerLeft: 0,
    imgSrc: "",
  });

  const [previewVisibility, setPreviewVisibility] = useState(false);

  const _getSeekbarWrapperRects = useCallback(() => {
    if (seekbarWrapperRef.current) {
      return (
        seekbarWrapperRef.current as HTMLDivElement
      ).getBoundingClientRect();
    }
    throw new Error("E_NO_SEEKBAR_REF");
  }, []);

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
      if (!seekbarWrapperRef.current) {
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
    [_getSeekbarWrapperRects]
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

  const _hidePreview = () => {
    setPreviewVisibility(() => false);
  };

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

  const seekbarWrapperProps = {
    onMouseLeave: () => {
      if (!isDragging.current) {
        _setIsDragging(false);
        _hidePreview();
      }
    },
    onMouseMove: (e: MouseEvent) => {
      _showPreview(e.clientX);
    },
    onMouseDown: (e: MouseEvent) => {
      _moveDragger(e.clientX);
      _setIsDragging(true);
    },
  };

  /**
   * currentTimeのontimeupdateに合わせてDraggerLeftを更新
   */
  useEffect(() => {
    //ドラッグ中であれば処理を行わない
    if (isDragging.current) return;
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
    setDraggerLeft((_) => newDraggerLeft);
    // _updateIsReviewingFlg(newDraggerLeft);
  }, [
    currentTime,
    _getSeekbarWrapperRects,
    setDraggerLeft,
    isDragging,
    liveModeEnabled,
    videoElement,
  ]);

  useEffect(() => {
    document.onmousemove = (e) => {
      if (isDragging.current) {
        _showPreview(e.clientX);
        _moveDragger(e.clientX);
        _setCurrentTimeFromClientX(e.clientX); // real time preview with scrubbing
      }
    };

    document.onmouseup = (e) => {
      if (isDragging.current) {
        _setCurrentTimeFromClientX(e.clientX);
        _setIsDragging(false);
        _hidePreview();
      }
    };

    //まれにdragイベントのみ発火してmousemoveイベントが発火しない場合があるため、
    //onmousemoveだけでなくdragも併用して設定すると安定する
    document.ondrag = (e) => {
      if (isDragging.current) {
        _showPreview(e.clientX);
        _moveDragger(e.clientX);
      }
    };

    document.ondragend = (e) => {
      if (isDragging.current) {
        _setCurrentTimeFromClientX(e.clientX);
        _setIsDragging(false);
      }
    };
  }, [_showPreview, _moveDragger, _setCurrentTimeFromClientX, _setIsDragging]);

  return {
    seekbarWrapperRef,
    seekbarHeight,
    draggerRef,
    draggerRadius,
    draggerLeft,
    previewVisibility,
    previewImgSrc: previewState.imgSrc,
    previewCurrentTime_sec: previewState.currentTime_sec,
    previewContainerLeft: previewState.containerLeft,
    seekbarWrapperProps,
  };
};

export default useVideoSeekbar;