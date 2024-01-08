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
// import { DocumentOverviewActivator } from "@/containers/DocumentOverviewActivator";

export const PlayerCombinedView: React.FC<{
  zIndex?: number;
  swapvidDesktopEnabled?: boolean;
}> = ({ zIndex, swapvidDesktopEnabled }) => (
  <div className="combined-view-container" style={{ zIndex: zIndex ?? "auto" }}>
    <div className="player-container relative max-w-[1440px] max-h-[90%] z-0">
      <VideoPlayer desktopCaptureEnabled={swapvidDesktopEnabled} />

      {swapvidDesktopEnabled ? (
        <ShowDocumentPlayerOnDesktopCaptured>
          <CroppedAreaPositioner>
            <DocumentPlayer />
          </CroppedAreaPositioner>
        </ShowDocumentPlayerOnDesktopCaptured>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full">
          <DocumentPlayer />
        </div>
      )}

      <DocumentOverview widthPx={200} />
      <VideoSubtitles />
    </div>

    {!swapvidDesktopEnabled && (
      <VideoSeekbar seekbarHighlightEnabled zIndex={20} />
    )}
    <VideoToolbar
      playAndPauseButtonEnabled
      ambientBackgroundEnabled
      zIndex={10}
    />
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
    className="combined-view-container flex items-center gap-8 max-w-full h-full overflow-scroll scrollbar-hidden mx-auto"
    style={{ zIndex: zIndex ?? "auto" }}
  >
    <div className="player-container relative z-0 w-1/2">
      <div className="grid w-full">
        <VideoPlayer />
        <VideoSubtitles />
      </div>

      <VideoSeekbar />
      <VideoToolbar
        playAndPauseButtonEnabled
        ambientBackgroundEnabled={false}
      />
    </div>

    <div className="document-player-outer flex-xyc gap-2 w-1/2 w-full h-full z-0">
      <DocumentPlayer standaloneModeEnabled />
      <DocumentOverview widthPx={150} standaloneModeEnabled />
    </div>
  </div>
);
