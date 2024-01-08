import React, { createContext, PropsWithChildren, useState } from "react";
import { TDocumentTimeline } from "@/types/swapvid";

export type TScrollTimeline = null | TDocumentTimeline[number];
export type TScrollTimelineCtx = TScrollTimeline;
export const ScrollTimelineCtx = createContext<TScrollTimelineCtx>(null);
export type TSetScrollTimelineCtx = React.Dispatch<
  React.SetStateAction<TScrollTimeline>
> | null;
export const SetScrollTimelineCtx = createContext<TSetScrollTimelineCtx>(null);

export type TActiveScrollTimeline = null | TDocumentTimeline[number];
export type TActiveScrollTimelineCtx = TActiveScrollTimeline;
export const ActiveScrollTimelineCtx =
  createContext<TActiveScrollTimelineCtx>(null);
export type TSetActiveScrollTimelineCtx = React.Dispatch<
  React.SetStateAction<TActiveScrollTimeline>
> | null;
export const SetActiveScrollTimelineCtx =
  createContext<TSetActiveScrollTimelineCtx>(null);

export default function TimelineCtxProvider(props: PropsWithChildren) {
  const [activeScrollTimeline, setActiveScrollTimeline] =
    useState<TActiveScrollTimeline>(null);
  return (
    <SetActiveScrollTimelineCtx.Provider value={setActiveScrollTimeline}>
      <ActiveScrollTimelineCtx.Provider value={activeScrollTimeline}>
        {props.children}
      </ActiveScrollTimelineCtx.Provider>
    </SetActiveScrollTimelineCtx.Provider>
  );
}
