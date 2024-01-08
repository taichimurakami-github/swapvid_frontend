import React from "react";
import { useAtomValue } from "jotai/react";
import {
  assetIdAtom,
  documentPlayerActiveAtom,
  relatedVideoTimeSectionsAtom,
  swapvidInterfaceTypeAtom,
  videoMetadataAtom,
} from "@/providers/jotai/swapVidPlayer";
import { SeekbarHighlightSection } from "@/presentations/SeekbarHighlightSection";

/**
 * 呼び出し元の親コンポーネントに関する条件：
 * 1. 幅・高さがシークバーのラッパーコンポーネントと同一である
 * 2. スタイリングでposition: relativeを指定している
 */
const _SeekbarHighlight: React.FC<{
  active?: boolean;
  userViewportEffectEnabled?: boolean; // Transparent seekbar-highlighting area gradually appears/disappears according to user's document viewport
  smoothingSeekbarHighlightGapEnabled?: boolean;
  samplingRateSec?: number;
  dispatchClickEvent?: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({
  active,
  userViewportEffectEnabled,
  smoothingSeekbarHighlightGapEnabled,
  samplingRateSec,
}) => {
  const videoMetadata = useAtomValue(videoMetadataAtom);
  const documentPlayerActive = useAtomValue(documentPlayerActiveAtom);
  const interfaceType = useAtomValue(swapvidInterfaceTypeAtom);
  const assetId = useAtomValue(assetIdAtom);
  const relatedVideoSections = useAtomValue(relatedVideoTimeSectionsAtom);

  const SAMPLING_RATE_SEC = samplingRateSec ?? 1;
  const VIEWPORT_INCLUSION_THRESHOLD = 0.5;

  if (!active) {
    return <></>;
  }

  const componentVisible = documentPlayerActive || interfaceType === "parallel";

  const t_max = videoMetadata.duration;

  // Length of the gap between highlight areas as a percentage of the width of the parent component.
  const gapPct =
    smoothingSeekbarHighlightGapEnabled ?? true
      ? (100 * SAMPLING_RATE_SEC) / t_max
      : 0;

  return (
    <>
      {relatedVideoSections.map((v /** v = [t_start, t_end, opacity] */) => {
        /**
         * 1. Calculate the width of the highlight area
         *    as a percentage of the width of the parent component.
         */
        const sectionTimeDelta = v[1] - v[0];
        const widthPct = 100 * (sectionTimeDelta / t_max);

        /**
         * 2. Calculate the distance
         *    from the left edge of the parent component
         *    to the left edge of the section
         *    as a percentage of the total width.
         */
        const leftPct = (100 * v[0]) / t_max;

        /**
         * 3. Determine the opacity value of the highlight area.
         *    If the disableViewportEffectOnSeekbarHighlight flag is set,
         *    the opacity value is forcely set to 1.
         */
        const opacity =
          userViewportEffectEnabled ?? true
            ? v[2] // If gradient is enabled, apply raw value of opacity (=v[2]).
            : v[2] > VIEWPORT_INCLUSION_THRESHOLD // If gradient is disabled, switch visible/hidden according to the opacity value.
            ? 1
            : 0;

        return (
          <SeekbarHighlightSection
            /**
             * To avoid the gap between highlight areas,
             * expand the highlight area by gapPct / 2 from the left and right.
             *
             * from:
             * |  <highlight01>  <highlight02>  | <- SeekBar component
             *
             * to:
             * | < highlight01 >< highlight02 > | <- SeekBar component
             */
            key={`${assetId}_highlight_${JSON.stringify(v)}`}
            leftPct={leftPct - gapPct / 2}
            widthPct={widthPct + gapPct}
            visible={componentVisible}
            opacity={opacity}
          />
        );
      })}
    </>
  );
};

export const SeekbarHighlight = React.memo(_SeekbarHighlight);
