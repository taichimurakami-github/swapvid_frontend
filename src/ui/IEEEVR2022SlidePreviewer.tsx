import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import animations from "@styles/animation.module.scss";

import React, { PropsWithRef, forwardRef, CSSProperties } from "react";

type TSlideTimeline = {
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

export const IEEEVR2022SlideScrollSnapPlayer = forwardRef(
  (
    props: PropsWithRef<{
      playerActive: boolean;
      timeline: TSlideTimeline;
      gapBetweenSlidesPx: number;
      playerWrapperId: string;
      onPlayingSlideId?: number | undefined;
      enableStaticMode?: boolean;
      onHandleScrollY: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
    }>,
    scrollWrapperRef?: React.ForwardedRef<HTMLDivElement | null>
  ) => {
    // const gapBetweenPreviewsPx = 50;
    const insideSlideComponentIdPrefix = "slidePreviewerInsideContent_";
    return (
      <div
        id={props.playerWrapperId}
        className={`scrollbar-hidden overflow-scroll absolute-xc top-0 w-full 
          h-full bg-black-transparent-02 flex flex-col 
          //snap-mandatory //snap-y
          ${
            props.playerActive
              ? animations["player-fade-in"]
              : animations["player-fade-out"]
          }
        `}
        ref={scrollWrapperRef}
        style={{
          gap: props.gapBetweenSlidesPx,
        }}
        onScroll={props.onHandleScrollY}
      >
        {props.timeline.map((v) => {
          const id = insideSlideComponentIdPrefix + v.id;

          return (
            <div
              id={id}
              className={`relative snap-center max-h-full snap-top`}
              key={id + "_key"}
            >
              <div className="relative">
                <img className="slide-bg-image h-full w-full" src={v.src}></img>
                {!props.enableStaticMode &&
                  props.onPlayingSlideId === v.id &&
                  props.playerActive && (
                    <div className={`absolute top-0 left-0 w-full h-full`}>
                      <div
                        className={`flex gap-[15px] justify-end items-center p-4 text-white text-white font-bold text-lg gap-4 bg-red-600 opacity-80`}
                      >
                        <FontAwesomeIcon
                          className="text-xl"
                          icon={faPlay}
                        ></FontAwesomeIcon>
                        動画内で再生中のスライド
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
