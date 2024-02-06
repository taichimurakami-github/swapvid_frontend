/**
 * APP SYSTEM CONFIGS
 */
export const ACTIVE_ASSET_ID_LS_CACHE_KEY = "__lastActiveAssetId";
export const ACTIVE_VIEW_MODE_LS_CACHE_KEY = "__lastActiveViewMode";

/**
 * Sequence Analyzer Initial Settings
 */

export const BACKEND_SERVICES = {
  PROTOCOL: {
    SEQUENCE_ANALYZER: "http",
    PDF_RECEIVER: "http",
    PDF_ANALYZER: "ws",
    FILE_EXPLORER: "http"
  },
  PORT: {
    SEQUENCE_ANALYZER: 8881,
    PDF_RECEIVER: 8882,
    PDF_ANALYZER: 8883,
    FILE_EXPLORER: 8884
  }
}

export const ENABLE_POC_USER_STUDY_MODE = false;

export const ASSET_ID_LIST = [
  /**
   * Slide Assets
   */
  "CHI2021Fujita", // Slide #1
  "IEEEVR2022Ogawa", // Slide #2
  "IEEEVR2022Hoshikawa", // Slide #3
  "SampleLectureLLM01", // Slide #4

  /**
   * Document Assets
   */
  "EdanMeyerVpt", // Document #1
  "EdanMeyerAlphaCode", // Document #2

  // "EdanMeyerGymMuRts", //
] as const;
