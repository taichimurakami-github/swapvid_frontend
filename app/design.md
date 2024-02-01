## Issues

- DocumentOverview
  - onMount 時に videoArea, documentArea が正しく表示されない
- PlayerCombinedViewRoot
  - Parallel View のテスト (mediatype: local でデバッグ)
  - Sequence Analyzer を用いたテスト (mediatype: live-streaming でデバッグ)
- AppMenu
  - メニューの実装
    - Media source の選択
      - Live-streaming
      - streaming
      - local
    - App Config
      - Debug
        <!-- - State visualizer の起動 -->
        - Sequence Analyzer visualizer の起動

## Design

```tsx

const design = () => (
<>
<Pres.VideoToolbar />
  {/**
    1. Update videoElement.paused / muted
    2. Observe videoElement.paused / muted
  */}



<Cont.VideoSeekbar />

    <SeekbarDecorator />
      {/**
        1. Calculate current active time sections (highlight section) from atom.userDocumentViewport, when it's changed.
        2. Render caluculated highlight section.
        */}

<Cont.DocumentPlayer
    {/* locationSyncEnabled: boolean; */}
    {/* playerMaxHeight?: number; */}
    {/* forceDispatchVideoElementClickEnabled?: boolean; */}
    {/* forcePlayerActivationByUserManipulationEnabled?: boolean; */}
    {/* skipRenderTextLayerEnabled?: boolean; */}
/>
    {/**
        1. Render LocationSyncronizedPDF component.
        2. Update atom.documentPlayerActive/Standby
        3. Update atom.videoViewport when video.onTimeUpdate changed, if locationSyncEnabled is true.
          -> useVideoViewportObserver(): void
        4. Update atom.userDocumentViewport when ref.documentWrapper is scrolled
        -> useUserDocumentViewportObserver(): (currDocViewport: TBBox) => void
      */}



  {/**
      + hooks:
        useDocumentPlayerEngine()
          >> useVideoViewportObserver()
          >> useUserDocumentViewportObserver()
    */}

    {/* (All children are memorized component.) */}
<div id="documentWrapper" ref={documentWrapperRef}>

        <div id ="documentContainer" ref={documentContainerRef}>
          <Pres.DocumentPlayerViewCombined // Memoized component
            width={0 | undefined}
            height={0|undefined}
          />
              <PDFRenderer
                width={0 | undefined}
               />
                {/*
                  1. Load pdf by react-pdf on component mounted
                  2. Set documentContainer with
                  */}

          <Cont.DocumentPlayerViewParallel // Memoized component
            width={0 | undefined}
            height={0|undefined}
          />
              <PDFRenderer
                width={props.width}
                ref={documentContainerRef}
              />
                  {/*
                    1. Update atom.pdfRendererState (pdfLoaded/Rendered/PageLength)
                  */}

                  <Document>
                    <Page>
        </div></div>
</>
)
```

## Hooks

```ts
/**
 * 1. Triggered when (i)Interval is consumed and (ii)videoElement.onTimeUpdate event dispatched
 * 2. Get current atom.videoViewport from scrollTimeline data.
 * 3. Dispatch current videoViewport to atom.videoViewport.
 */
function useVideoViewportObserver(videoElement: HTMLVideoElement): void;

/**
 * 1. Define
 */
function useUserDocumentViewportObserver(): void;
```
