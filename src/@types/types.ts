import { ASSET_ID_LIST } from "@/app.config";
import { PropsWithChildren } from "react";

export type TContentType = "slide" | "document" | "web";

export type TContentTimeline = {
  //content identifier
  id: number;
  contentId: string;
  contentType: TContentType;
  page: {
    id: number;
    diff: number;
  };

  //content timeline infomation
  beginAt: number;
  endAt: number;

  //content src infomation
  thumbnailSrc: string;

  //content layout infomation
  metadata: {
    top: number | string;
    left: number | string;
    width: number | string;
    height?: number | string;
  };
};

export type TContentData = {
  [contentId: string]: {
    // type: "slide" | "document" | "web" | "others";
    type: string;
    //static modules, href, ...
    src: string[];
    memo?: {
      scrollCache?: number[];
    };
    url?: string;
  };
};

export type TContextTimeline = {
  id: number;
  contentId: string;
  contentType: TContentType;
  thumbnailSrc: string;
  i_start: number;
  i_end: number;
};

export type TAssetId = (typeof ASSET_ID_LIST)[number];

export type TInterfaceMode = "parallel" | "combined" | "servertest";

export type TSubtitlesData = {
  id: number;
  startAt: number;
  endAt: number;
  subtitle: string;
}[];

export type TTaskMetaData = {
  id: string;
  type:
    | "summarization"
    | "text-based-search-in-document"
    | "image-based-search-in-document"
    | "text-based-search-in-video"
    | "image-based-search-in-video";
  title: string;
  description: string[];
  t?: number;
  autoPlay?: boolean;
  disableSeekbar?: boolean;
  disablePauseAndPlay?: boolean;
};

export type TSlideTimeline_IEEEVR2022 = {
  id: number;
  src: string;
  startAt: number;
  movie?: {
    src: string;
    posterSrc: string;
    top: string | number;
    left: string | number;
    width: string | number;
    height: string | number;
  };
}[];

export type TDocumentTimeline = {
  id: number;
  time: [number, number];
  zoomRate: number;

  //if not on displayed, set scrollYAmount = -Infinity and scrollMode = "noscroll".
  videoViewport: TBoundingBox | null;
  scrollMode: "linear" | "noscroll";
}[];

export type TBoundingBox = [[number, number], [number, number]];

export type TBoundingBoxWithOffset = [
  [number, number], // [position.left, position.top]
  [number, number], // [position.right, position.bottom]
  [number, number] // [offset.left, offset.top]
];

export type TServerGeneratedScrollTimeline = {
  // tl_document_scrollY: (
  //   | (number | null)[]
  //   | (
  //       | number
  //       | { offset: number[][]; linePosition: number[][]; content: string }
  //     )[]
  // )[];
  tl_document_scrollY: (
    | [
        number, // time
        number, // vf_zoom_rate
        TBoundingBox, // invid focused area bbox
        {
          linePosition: TBoundingBoxWithOffset;
          content: string;
        },
        {
          linePosition: TBoundingBoxWithOffset;
          content: string;
        }
      ]
    | [number, null]
  )[];
  media_metadata: [number, number, number, number];
  document_metadata: [number, number];
};

export type TServerGeneratedActivityTimeline = {
  video_metadata: [number, number];
  doc_metadata: [number, number];
  activities: [
    [number, number], // section time (t_prev, t_curr)
    TBoundingBox, // bounding box of activity detected video frame offset (absolute px, from scroll timeline)
    [string, TBoundingBox][] // [(asset_imageDataUrl), (relative rate bouding box per videoframe)][]
  ][];
};

export type TInterfaceCombinationPatterns = "A" | "AR" | "B" | "BR";

export type TPlayerContainerProps = PropsWithChildren<{
  videoElement: HTMLVideoElement;
}>;
