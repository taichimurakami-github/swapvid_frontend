import { TDocumentTimeline } from "@/types/swapvid";
import Validate from "./validate";

export class DocumentPlaytimeIndexer {
  indexData: {
    sectionId: number;
    time: [number, number];
    scrollStart: number;
    scrollEnd: number;
    scrollRange: number;
  }[];

  constructor(indexData: TDocumentTimeline) {
    this.indexData = indexData.map((v, i) => {
      //timelineにおいて，2連続でnullが来ることはない
      const scrollStart = i === 0 ? 0 : indexData[i - 1].scrollYAmount;
      const scrollEnd = v.scrollYAmount;

      const scrollRange =
        scrollStart === -Infinity || //直前のパートがインデックスされない
        scrollEnd === -Infinity || // 該当パートがインデックスされない（画面が切り替わっている等）
        scrollEnd === Infinity || //該当パート以降，スクロールされない
        v.scrollMode === "noscroll" //カット編集後のシーンである,()
          ? 0 //no scroll
          : scrollEnd - scrollStart; //linear scroll

      if (scrollRange < 0) {
        throw new Error("Error: scrollY start must be larger than scrollY end");
      }

      return {
        sectionId: i,
        time: v.time,
        scrollStart: scrollStart,
        scrollEnd: scrollEnd,
        scrollRange: scrollRange,
      };
    });
  }

  public getScrollYFromPlaytime(time: number, maxScrollY: number): number {
    const currentIndex =
      this.indexData.find((v) => v.time[0] <= time && time < v.time[1]) ??
      this.indexData[this.indexData.length - 1];

    if (currentIndex.scrollRange === 0) {
      return currentIndex.scrollEnd * maxScrollY;
    }

    const [startTime, endTime] = [currentIndex.time[0], currentIndex.time[1]];

    const timeRate = (time - startTime) / (endTime - startTime);
    const scrollRange = currentIndex.scrollRange;
    const initialScrollYAmount =
      currentIndex.sectionId === 0
        ? 0
        : this.indexData[currentIndex.sectionId - 1].scrollEnd;

    const newScrollY =
      (initialScrollYAmount + scrollRange * timeRate) * maxScrollY;

    return Validate.clamp(0, newScrollY, maxScrollY);
  }

  public getPlaytimeFromScrollY(
    scrollY: number,
    maxScrollY: number,
    videoDuration: number
  ): [number, number][] {
    const MARGIN = 30;
    const currentIndexes = this.indexData.filter((v, i) => {
      return (
        v.scrollStart * maxScrollY - MARGIN <= scrollY &&
        scrollY <= v.scrollEnd * maxScrollY + MARGIN
      );
    });

    const result: [number, number][] = [];

    for (const v of currentIndexes) {
      if (v.scrollRange === 0) {
        //スクロールなしのセクションの場合，セクションの開始と終了の時間をそのままreturn
        result.push(
          videoDuration < v.time[1] //time[1]がInfinityの場合，ビデオの終了まで位置が持続するとみなす
            ? [v.time[0], videoDuration] //time[start, videoEnd]に置換
            : v.time //time[start, end] をそのまま代入
        );
        continue;
      }

      //スクロールありのセクションの場合，auto-scrollアルゴリズムの逆算式からtを推定
      const t_s = v.time[0];
      const t_e = v.time[1];
      const y = scrollY;
      const y_init = v.scrollStart * maxScrollY;
      const y_max = maxScrollY;
      const r_scroll = v.scrollRange;
      const t = t_s + ((y - y_init) * (t_e - t_s)) / (y_max * r_scroll);

      result.push([t, t]);
    }

    return result;
  }
}
