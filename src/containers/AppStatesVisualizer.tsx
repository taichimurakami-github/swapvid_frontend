import React, { PropsWithChildren } from "react";
import { useAtomValue } from "jotai/react";
import {
  appMenuActiveAtom,
  assetIdAtom,
  documentOverviewImgSrcAtom,
  documentPlayerActiveAtom,
  documentPlayerLayoutAtom,
  documentPlayerStandbyAtom,
  mediaSourceTypeAtom,
  pdfPageStateAtom,
  pdfRendererStateAtom,
  pdfUploaderActiveAtom,
  pipVideoWindowActiveAtom,
  preGeneratedScrollTimelineDataAtom,
  relatedVideoTimeSectionsAtom,
  scrollTimelineDataAtom,
  sequenceAnalyzerStateAtom,
  subtitlesActiveAtom,
  subtitlesDataAtom,
  swapvidDesktopEnabledAtom,
  swapvidInterfaceTypeAtom,
  userDocumentViewportAtom,
  videoCropperActiveAtom,
  videoElementStateAtom,
  videoMetadataAtom,
  videoPlayerLayoutAtom,
  videoSrcAtom,
  videoViewportAtom,
} from "@/providers/jotai/swapVidPlayer";

export const AppStatesVisualizer: React.FC<{
  active: boolean;
}> = ({ active }) => {
  const videoPlayerLayout = useAtomValue(videoPlayerLayoutAtom);
  const videoMetadata = useAtomValue(videoMetadataAtom);
  const videoElementState = useAtomValue(videoElementStateAtom);

  const documentPlayerLayout = useAtomValue(documentPlayerLayoutAtom);
  const documentPlayerActive = useAtomValue(documentPlayerActiveAtom);
  const documentPlayerStandby = useAtomValue(documentPlayerStandbyAtom);
  const pipVideoWindowActive = useAtomValue(pipVideoWindowActiveAtom);

  const userDocumentViewport = useAtomValue(userDocumentViewportAtom);
  const videoViewport = useAtomValue(videoViewportAtom);
  const scrollTimelineData = useAtomValue(scrollTimelineDataAtom);
  const relatedVideoTimeSections = useAtomValue(relatedVideoTimeSectionsAtom);

  const subtitlesActive = useAtomValue(subtitlesActiveAtom);
  const pdfRendererState = useAtomValue(pdfRendererStateAtom);
  const pdfPageState = useAtomValue(pdfPageStateAtom);

  const swapVidInterfaceType = useAtomValue(swapvidInterfaceTypeAtom);
  const mediaSourceType = useAtomValue(mediaSourceTypeAtom);
  const appMenuActive = useAtomValue(appMenuActiveAtom);
  const sequenceAnalyzerState = useAtomValue(sequenceAnalyzerStateAtom);

  const assetId = useAtomValue(assetIdAtom);
  const videoSrc = useAtomValue(videoSrcAtom);
  const documentOverviewImgSrc = useAtomValue(documentOverviewImgSrcAtom);
  const subtitlesData = useAtomValue(subtitlesDataAtom);
  const preGeneratedScrollTimelineData = useAtomValue(
    preGeneratedScrollTimelineDataAtom
  );

  const swapVidDesktopEnabled = useAtomValue(swapvidDesktopEnabledAtom);
  const videoCropperActive = useAtomValue(videoCropperActiveAtom);
  const pdfUploaderActive = useAtomValue(pdfUploaderActiveAtom);

  if (!active) {
    return null;
  }

  return (
    <ul className="grid gap-2">
      <p className="text-center text-2xl underline">Click to copy the value</p>

      <SectionTitle>Video Player</SectionTitle>
      <Item label="videoPlayerLayout" value={videoPlayerLayout} />
      <Item label="videoMetadata" value={videoMetadata} />
      {/* <Item label="videoElementRef" value={videoElementRef?.current} /> */}
      <Item label="videoElementState" value={videoElementState} />

      <SectionTitle>Document Player</SectionTitle>
      <Item label="documentPlayerLayout" value={documentPlayerLayout} />
      <Item label="documentPlayerActive" value={documentPlayerActive} />
      <Item label="documentPlayerStandby" value={documentPlayerStandby} />
      <Item label="pipVideoWindowActive" value={pipVideoWindowActive} />

      <SectionTitle>Viewports</SectionTitle>
      <Item label="userDocumentViewport" value={userDocumentViewport} />
      <Item label="videoViewport" value={videoViewport} />

      <SectionTitle>User Viewport Related Video Times</SectionTitle>
      <Item label="relatedVideoTimeSections" value={relatedVideoTimeSections} />

      <SectionTitle>Local Timeline Data</SectionTitle>
      <Item label="scrollTimelineData" value={scrollTimelineData} />

      <Item label="subtitlesActive" value={subtitlesActive} />
      <Item label="pdfRendererState" value={pdfRendererState} />
      <Item label="pdfPageState" value={pdfPageState} />

      <SectionTitle>SwapVid Player</SectionTitle>
      <Item label="swapVidInterfaceType" value={swapVidInterfaceType} />
      <Item label="mediaSourceType" value={mediaSourceType} />
      <Item label="appMenuActive" value={appMenuActive} />
      <Item label="sequenceAnalyzerState" value={sequenceAnalyzerState} />

      <SectionTitle>SwapVid Desktop</SectionTitle>
      <Item label="swapVidDesktopEnabled" value={swapVidDesktopEnabled} />
      <Item label="videoCropperActive" value={videoCropperActive} />
      <Item label="pdfUploaderActive" value={pdfUploaderActive} />

      <SectionTitle>Assets</SectionTitle>
      <Item label="assetId" value={assetId} />
      <Item label="videoSrc" value={videoSrc} />
      <Item label="documentOverviewImgSrc" value={documentOverviewImgSrc} />
      <Item label="subtitlesData" value={subtitlesData} />
      <Item
        label="preGeneratedScrollTimelineData"
        value={preGeneratedScrollTimelineData}
      />
    </ul>
  );
};

const Item: React.FC<{ label: string; value: unknown }> = ({
  label,
  value,
}) => (
  <li
    className="flex gap-2 px-2 py-4 w-full justify-between rounded-sm hover:bg-gray-200 border-b-[2px] border-neutral-200"
    onClick={() => {
      navigator.clipboard.writeText(JSON.stringify(value));
    }}
    key={label}
  >
    <span className="font-bold">{label}</span>
    <span className="select-none">{JSON.stringify(value)}</span>
  </li>
);

const SectionTitle: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mt-16 mb-2 mx-auto flex py-2 px-8 font-bold text-center text-xl text-slate-600 border-b-[2px] border-slate-600">
    {children}
  </h3>
);
