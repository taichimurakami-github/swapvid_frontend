import { AppConfig } from "@/containers/AppConfig";
import { ErrorBoundary } from "@/containers/ErrorBoundary";
import { SwapVidPlayerRoot } from "@/containers/SwapVidPlayerRoot";
import { VideoCropper } from "@/containers/VideoCropper";
import { AppModalRoot } from "./containers/AppModalRoot";

export type TAppMode = "PoCUserStudy" | "SwapVid";

export default function App() {
  return (
    <div className="app-container relative bg-neutral-800 box-border z-0 h-screen flex-xyc flex-col">
      <ErrorBoundary>
        <SwapVidPlayerRoot zIndex={0} />
        <VideoCropper zIndex={10} />
        <AppModalRoot zIndex={20} />
      </ErrorBoundary>

      <AppConfig zIndex={20} />
    </div>
  );
}
