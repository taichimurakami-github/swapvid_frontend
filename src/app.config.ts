/**
 * APP SYSTEM CONFIGS
 */

export const ACTIVE_ASSET_ID_LS_CACHE_KEY = "__lastActiveAssetId";

export const ASSET_ID_LIST = [
  /**
   * Slide Assets
   */
  // "CHI2021Fujita", // Slide #1
  // "IEEEVR2022Ogawa", // Slide #2
  // "IEEEVR2022Hoshikawa", // Slide #3

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
