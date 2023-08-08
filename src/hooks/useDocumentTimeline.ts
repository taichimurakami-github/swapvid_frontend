import {
  TBoundingBox,
  TDocumentTimeline,
  TServerGeneratedActivityTimeline,
  TServerGeneratedScrollTimeline,
} from "@/@types/types";
import React, { useCallback, useMemo, useState } from "react";

export function useDocumentScrollTimeline(
  timeline: TServerGeneratedScrollTimeline
) {
  const documentTimeline = useMemo<TDocumentTimeline>(
    () =>
      timeline.tl_document_scrollY.reduce<TDocumentTimeline>(
        (prevResult, currValue, i) => {
          const result = [...prevResult];
          const currSectionTime = currValue[0];

          // セクションを閉じる
          if (currSectionTime > 1) {
            result[result.length - 1].time[1] = currSectionTime - 1;
          }

          // 動画内での注目エリアのBBOXを算出
          const invidFocusedAreaInDocRate = currValue[1] //currValue = (t_frame, null)の場合はマッチングしていない区間とみなす
            ? (currValue[2] as TBoundingBox)
            : null;

          // 新たにセクションを定義
          result.push({
            id: i,
            time: [currSectionTime, Infinity],
            zoomRate: currValue[1] ?? 1.0,
            invidFocusedArea: invidFocusedAreaInDocRate,
            scrollMode: "noscroll",
          });

          return result;
        },
        []
      ),
    [timeline]
  );

  return {
    timeline: documentTimeline,
  };
}

export function useDocumentActivityTimeline(
  activityTimeline: TServerGeneratedActivityTimeline,
  scrollTimeline: TServerGeneratedScrollTimeline,
  videoElem: HTMLVideoElement | null,
  renderedDocumentWrapperElem: HTMLElement | null
) {
  const [activityState, setActivityState] = useState(
    activityTimeline.activities.map((_) => false)
  );
  const getActivityAssets = useCallback(() => {
    const [vfWidth, vfHeght] = activityTimeline.video_metadata;
    return activityTimeline.activities.reduce<
      [
        number, //t_active
        [[number, number], [number, number]], // [position_pct_top, position_pct_left]
        string //dataurl
      ][]
    >((prevResult, activity, i) => {
      if (videoElem && renderedDocumentWrapperElem) {
        const t_active = activity[0][1];
        for (const asset of activity[2]) {
          // const renderedDocBrect = renderedDocumentWrapperElem.getBoundingClientRect()
          // const videoBrect = videoElem.getBoundingClientRect()
          // const renderedVideoFrameOffsetX = (renderedDocBrect.width - videoBrect.width) / 2

          const dataurl = asset[0];
          // const bbox_tl_raw_abs = [asset[1][0], [1]]; // [top_pctr, left_pctr]

          // bbox_tl_raw を rendered documentに合わせて変形させる

          prevResult.push([t_active, asset[1], dataurl]);
        }
      }

      // const r_bboxPosTop =0
      // const r_bboxPosLeft = 0;
      // const dataurl =

      return prevResult;
    }, []);
  }, [activityTimeline]);

  const getAssetsMetadata = useCallback(() => {
    const timeline = activityTimeline;
    return {
      document: {
        width: timeline.doc_metadata[0],
        height: timeline.doc_metadata[1],
      },
      video: {
        width: timeline.video_metadata[0],
        height: timeline.video_metadata[1],
      },
    };
  }, []);

  const updateAcitvityState = useCallback((t: number) => {
    setActivityState(activityTimeline.activities.map((v) => v[0][1] <= t));
  }, []);

  // const getCurrentActivity = useCallback(
  //   (t: number) =>
  //     timeline.activities.filter(
  //       (activity) => activity[0][0] <= t && t <= activity[0][1]
  //     ),
  //   [timeline]
  // );

  return {
    // getCurrentActivity,
    updateAcitvityState,
    activityState,
    getActivityAssets,
    getAssetsMetadata,
  };
}
