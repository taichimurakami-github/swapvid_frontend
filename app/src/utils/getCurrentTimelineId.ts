import { TContentTimeline } from "@/types/swapvid";

export const getCurrentTimelineId = (
  timeline: TContentTimeline[],
  currentTime_sec: number
) => {
  const time_ms = Math.round(currentTime_sec);
  for (let i = 0; i < timeline.length; i++) {
    const val = timeline[i];

    if (val.beginAt <= time_ms && time_ms <= val.endAt) {
      return i;
    }
  }

  return undefined;
};
