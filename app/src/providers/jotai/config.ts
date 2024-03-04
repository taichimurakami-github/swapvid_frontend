import { getJotaiStorageKey } from "@/utils/getKeyString";
import { atomWithStorage } from "jotai/utils";

/** TODO: Create setter as a reducer */
export const backendServiceConfigAtom = atomWithStorage(
  getJotaiStorageKey("backendServiceConfig"),
  {
    portFileExplorerApi: 8884,
    portPdfAnalyzerApi: 8883,
    portPdfReceiverApi: 8881,
    portSequenceAnalyzerApi: 8881,

    protocolFileExplorerApi: "http",
    protocolPdfAnalyzerApi: "ws",
    protocolPdfReceiverApi: "http",
    protocolSequenceAnalyzerApi: "http",

    cmdProtocolPdfAnalyzerApi: "inline",

    sequenceAnalyzerSyncIntervalMs: 1000,
  },
  undefined,
  { getOnInit: true }
);

export const sequenceAnalyzerSyncIntervalMsAtom = atomWithStorage(
  getJotaiStorageKey("sequenceAnalyzerSyncIntervalMsAtom"),
  1000,
  undefined,
  { getOnInit: true }
);

/** TODO: Create setter as a reducer */
export const userInterfaceConfigAtom = atomWithStorage(
  getJotaiStorageKey("userInterfaceConfig"),
  {
    pipVideoWindowWidthPx: 320,
    parallelViewMaxVideoWidthPx: 320,
    combinedViewMaxVideoWidthPx: 640,
    combinedViewMinVideoWidthPx: 320,
  },
  undefined,
  { getOnInit: true }
);

export const playerConfig = atomWithStorage(
  getJotaiStorageKey("playerConfig"),
  {},
  undefined,
  { getOnInit: true }
);
