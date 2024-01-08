import React, { createContext, PropsWithChildren, useState } from "react";
import { TBoundingBox } from "@/types/swapvid";

export type TCurrentVideoViewport = TBoundingBox | null;
export type TCurrentVideoViewportCtx = TCurrentVideoViewport;
export const CurrentVideoViewportCtx =
  createContext<TCurrentVideoViewportCtx>(null);
export type TSetCurrentVideoViewportCtx = React.Dispatch<
  React.SetStateAction<TCurrentVideoViewport>
> | null;
export const SetCurrentVideoViewportCtx =
  createContext<TSetCurrentVideoViewportCtx>(null);

export type TUserDocumentViewport = TBoundingBox | null;

export type TUserUserDocumentViewportCtx = TUserDocumentViewport;
export const UserDocumentViewportCtx =
  createContext<TUserUserDocumentViewportCtx>(null);

export type TSetUserDocumentViewportCtx = React.Dispatch<
  React.SetStateAction<TUserDocumentViewport>
> | null;
export const SetUserDocumentViewportCtx =
  createContext<TSetCurrentVideoViewportCtx>(null);

export default function ViewportCtxProvider(props: PropsWithChildren) {
  const [videoViewport, setVideoViewport] =
    useState<TCurrentVideoViewport>(null);
  const [documentViewport, setDocumentViewport] =
    useState<TUserDocumentViewport>(null);

  return (
    <SetUserDocumentViewportCtx.Provider value={setDocumentViewport}>
      <UserDocumentViewportCtx.Provider value={documentViewport}>
        <SetCurrentVideoViewportCtx.Provider value={setVideoViewport}>
          <CurrentVideoViewportCtx.Provider value={videoViewport}>
            {props.children}
          </CurrentVideoViewportCtx.Provider>
        </SetCurrentVideoViewportCtx.Provider>
      </UserDocumentViewportCtx.Provider>
    </SetUserDocumentViewportCtx.Provider>
  );
}
