import { CmdProtocolPdfAnalyzerApi, RequestProtocol } from "./backend";

export type BackendServiceConfig = {
  backendApiHost: string;

  portFileExplorerApi: number;
  portPdfAnalyzerApi: number;
  portPdfReceiverApi: number;
  portSequenceAnalyzerApi: number;

  protocolFileExplorerApi: RequestProtocol;
  protocolPdfAnalyzerApi: RequestProtocol;
  protocolPdfReceiverApi: RequestProtocol;
  protocolSequenceAnalyzerApi: RequestProtocol;

  cmdProtocolPdfAnalyzerApi: CmdProtocolPdfAnalyzerApi;

  sequenceAnalyzerSyncIntervalMs: number;
};

type VideoSeekbarConfig = {
  videoSeekbarBarHeightPx: number;
  videoSeekbarDraggerRadiusPx: number;
  videoSeekbarPreviewVideoUpdateIntervalSec: number;
};

type PipVideoWindowConfig = {
  pipVideoWindowWidthPx: number;
  pipVideoWindowSyncIntervalMs: number;
};

type ParallelViewConfig = {
  parallelViewMaxVideoWidthPx: number;
};

type CombinedViewConfig = {
  combinedViewVideoWidthPx: number;
  combinedViewVideoMaxWidthPx: number;
  combinedViewVideoMinWidthPx: number;
  combinedViewDocumentPlayerWidthPx: number;
  combinedViewDocumentPlayerMaxWidthPx: number;
  combinedViewDocumentPlayerMinWidthPx: number;
};

export type SwapVidPlayerUiConfig = VideoSeekbarConfig &
  PipVideoWindowConfig &
  ParallelViewConfig &
  CombinedViewConfig;
