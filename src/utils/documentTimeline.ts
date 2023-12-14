import { TDocumentTimeline } from "../types/swapvid";

export const getDocumentTimelineData = (
  startAt: number,
  endAt: number,
  scrollYAmount: number,
  scrollMode?: "linear" | "noscroll"
): TDocumentTimeline[0] => ({
  time: [startAt, endAt],
  scrollYAmount: scrollYAmount,
  scrollMode: scrollMode ?? "linear",
});
