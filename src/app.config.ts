/**
 * APP SYSTEM CONFIGS
 */
export const ACTIVE_ASSET_ID_LS_CACHE_KEY = "__lastActiveAssetId";
export const ACTIVE_VIEW_MODE_LS_CACHE_KEY = "__lastActiveViewMode";

/**
 * Sequence Analyzer Initial Settings
 */
// export const SEQUENCE_ANALYZER_API_ENDPOINT_HTTP = "http://localhost:8881/";
export const SEQUENCE_ANALYZER_API_ENDPOINT_HTTP = "http://0.0.0.0:8881/";
export const PDF_RECEIVER_API_ENDPOINT_HTTP = "http://0.0.0.0:8882/";
export const PDF_ANALYZER_API_ENDPOINT_WS = "ws://0.0.0.0:8883/";
export const INITIAL_ASSET_ID = "SampleLectureLLM01";

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
