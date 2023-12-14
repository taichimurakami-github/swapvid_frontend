/**
 * APP SYSTEM CONFIGS
 */
export const ACTIVE_ASSET_ID_LS_CACHE_KEY = "__lastActiveAssetId";
export const ACTIVE_VIEW_MODE_LS_CACHE_KEY = "__lastActiveViewMode";

// export const SEQUENCE_ANALYZER_API_ENDPOINT_HTTP = "http://localhost:8881/";
export const SEQUENCE_ANALYZER_API_ENDPOINT_HTTP = "http://0.0.0.0:8881/";
export const PDF_RECEIVER_API_ENDPOINT_HTTP = "http://0.0.0.0:8882/";
export const PDF_ANALYZER_API_ENDPOINT_WS = "ws://0.0.0.0:8883/";

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

export const UIELEM_ID_LIST = {
  system: {
    videoPlayer: {
      wrapper: "#videoPlayerWrapper",
      videoElement: "#video",
      dummyVideoElement: "#video__dummy",
      seekbarWrapper: "#seekbarWrapper",
      dragger: "#seekbarDragger",
      pauseAndPlayButton: "#pauseAndPlayBtn",
      muteButton: "#muteBtn",
      captionButton: "#captionBtn",
    },
    taskPlayer: {
      wrapper: "#TPlayerWrapper",
      taskSubmitFormWrapper: "#TSubmitForm",
    },
    pages: {
      taskPlayerActivateArea: "#taskPlayerActivater",
    },
    documentPlayer: {
      enableDocumentPlayerButton: "#enableDocPlayerBtn",
      disableDocumentPlayerButton: "#disableDocPlayerBtn",
      nonFocusProtector: "#__nonFocusProtector__",
    },
  },
  content: {
    //EdanMeyerStableDiffusion
    EdanMeyerStableDiffusion: {
      playerWrapper: "#docPlayer",
    },

    //EdanMeyerVpt
    EdanMeyerVpt: {
      // playerWrapper: "#docPlayer_EdanMeyerVpt",
      playerWrapper: "#docPlayer",
    },

    //EdanMeyerGymMuRts
    EdanMeyerGymMuRts: {
      // playerWrapper: "#docPlayer_EdanMeyerGymMuRts",
      playerWrapper: "#docPlayer",
    },

    CHI2021Fujita: {
      playerWrapper: "#docPlayer",
    },

    //IEEEVR2022Ogawa
    IEEEVR2022Ogawa: {
      // playerWrapper: "#docPlayer_IEEEVR2022Ogawa",
      playerWrapper: "#docPlayer",
    },

    //IEEEVR2022Hoshikawa
    IEEEVR2022Hoshikawa: {
      // playerWrapper: "#docPlayer_IEEEVR2022Hoshikawa",
      playerWrapper: "#docPlayer",
    },
  },
};
