import { TSlideTimeline_IEEEVR2022 } from "@/@types/types";

export class SlidePlaytimeIndexer {
  readonly indexData: {
    sectionId: number;
    slideId: number;
    time: [number, number];
    data: TSlideTimeline_IEEEVR2022[0];
  }[];
  readonly timeline: TSlideTimeline_IEEEVR2022;

  constructor(timeline: TSlideTimeline_IEEEVR2022) {
    this.timeline = timeline;
    this.indexData = timeline.map((v, i) => {
      const startTime = v.startAt;
      const endTime =
        i < timeline.length - 1 ? timeline[i + 1].startAt : Infinity;

      return {
        sectionId: i,
        slideId: v.id,
        time: [startTime, endTime],
        data: timeline[0],
      };
    });
  }

  public getOnPlayingSlideIdFromPlaytime(time: number): number | undefined {
    return this.indexData.find((v) => v.time[0] <= time && time <= v.time[1])
      ?.sectionId;
  }

  public getScrollYFromOnPlayingSlideId(
    onPlayingSlideId: number,
    slideComponentParentElem: HTMLElement,
    gapBetweenSlidesPx: number
  ): number {
    let scrollYAmount = 0;
    const slideComponents = slideComponentParentElem.children;

    for (let i = 1; i < slideComponents.length; i++) {
      if (i > onPlayingSlideId) break;

      const height = slideComponents.item(i)?.clientHeight || 0;
      scrollYAmount += gapBetweenSlidesPx + height;
    }

    return scrollYAmount;
  }

  public getOnViewingSlidePlaytimeFromScrollY(
    scrollY: number,
    slideComponentParentElem: HTMLElement,
    gapBetweenSlidesPx: number,
    videoDuration: number
  ): [number, number][] {
    const slideComponents = slideComponentParentElem.children;
    let y_baseline = 0;
    let i_target = -1;

    for (let i = 0; i < slideComponents.length - 1; i++) {
      const targetSlideAreaHeight = slideComponents[i].clientHeight;
      const y_endline = y_baseline + targetSlideAreaHeight;

      if (y_baseline <= scrollY && scrollY <= y_endline) {
        i_target = i;
        break;
      }

      y_baseline = y_endline + gapBetweenSlidesPx;
    }

    // 最後のスライドのマッチングのみ独立実行
    if (i_target < 0 && y_baseline <= scrollY) {
      i_target = slideComponents.length - 1;
    }

    const currentIndex = this.indexData.filter((v) => v.slideId === i_target);

    return currentIndex.map((v) => {
      // infinityが含まれていたら除外
      return v.time[1] === Infinity ? [v.time[0], videoDuration] : v.time;
    });
  }

  public getPlaytimeFromSlideId(slideIdList: number[]): [number, number][] {
    const currentIndex = this.indexData.filter((v) =>
      slideIdList.includes(v.sectionId)
    );
    return currentIndex.map((v) => v.time);
  }
}
