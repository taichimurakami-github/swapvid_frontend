import { DocumentPlayer } from "@/containers/DocumentPlayer";
import { PiPVideoWindow } from "@/containers/PiPVideoWindow";
import { VideoPlayer } from "@/containers/VideoPlayer";
import { VideoSubtitles } from "@/containers/VideoSubtitles";
import { VideoSeekbar } from "@/containers/VideoSeekbar";
import { VideoToolbar } from "@/containers/VideoToolbar";
import { DocumentOverview } from "@/containers/DocumentOverview";
import { CroppedAreaPositioner } from "@/containers/AreaPositioner";
import {
  ShowDocumentPlayerOnDesktopCaptured,
  SwapVidDesktopMenu,
} from "@/containers/SwapVidDesktopUtils";
import { DocumentOverviewActivator } from "@/containers/DocumentOverviewActivator";

export const PlayerCombinedView: React.FC<{
  zIndex?: number;
  swapvidDesktopEnabled?: boolean;
}> = ({ zIndex, swapvidDesktopEnabled }) => (
  <div
    className="combined-view-container max-w-full max-h-full p-4"
    style={{ zIndex: zIndex ?? "auto" }}
  >
    <div className="player-container relative max-w-full max-h-full z-0">
      <VideoPlayer />

      {swapvidDesktopEnabled ? (
        <ShowDocumentPlayerOnDesktopCaptured>
          <CroppedAreaPositioner zIndex={10}>
            <DocumentPlayer />
          </CroppedAreaPositioner>
        </ShowDocumentPlayerOnDesktopCaptured>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <DocumentPlayer />
        </div>
      )}

      <DocumentOverviewActivator width={50} height={"100%"} zIndex={30} />
      <DocumentOverview widthPx={200} zIndex={30} />
      <VideoSubtitles />
    </div>

    {!swapvidDesktopEnabled && (
      <VideoSeekbar seekbarHighlightEnabled zIndex={20} />
    )}
    <VideoToolbar ambientBackgroundEnabled zIndex={10} />
    <PiPVideoWindow windowWidthPx={250} zIndex={30} />

    {swapvidDesktopEnabled && (
      <>
        <div className="h-2"></div>
        <SwapVidDesktopMenu />
      </>
    )}
  </div>
);

export const PlayerParallelView: React.FC<{ zIndex?: number }> = ({
  zIndex,
}) => (
  <div
    className="combined-view-container flex items-center gap-8 px-4 max-w-full h-full overflow-scroll scrollbar-hidden mx-auto"
    style={{ zIndex: zIndex ?? "auto" }}
  >
    <div className="player-container relative z-0 max-w-[50%]">
      <div className="grid w-full">
        <VideoPlayer playerWidth={1280} />
        <VideoSubtitles />
      </div>

      <VideoSeekbar />
      <VideoToolbar ambientBackgroundEnabled={false} />
    </div>

    <div className="document-player-outer relative flex-xyc gap-2 max-w-[50%] h-full z-0">
      <DocumentPlayer playerWidth={800} standaloneModeEnabled />
      {/* <DocumentOverview widthPx={100} standaloneModeEnabled /> */}
    </div>
  </div>
);
