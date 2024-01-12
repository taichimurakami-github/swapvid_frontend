import { videoPlayerLayoutAtom } from "@/providers/jotai/store";
import { useAtomValue } from "jotai/react";
import React, { PropsWithChildren } from "react";

export const PlayerCombinedViewContainer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const videoPlayerLayout = useAtomValue(videoPlayerLayoutAtom);

  return (
    <div
      className="player-container relative max-w-[1440px] max-h-[80vh] z-0"
      style={{
        width: videoPlayerLayout.width,
        // height: videoPlayerLayout.height,
      }}
    >
      {children}
    </div>
  );
};
