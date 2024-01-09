import { AppConfig } from "./containers/AppConfig";
import { ErrorBoundary } from "./containers/ErrorBoundary";
import { LocalFilePicker } from "./containers/FilePicker";
import { PdfUplorder } from "./containers/PDFUplorder";
import { SwapVidPlayerRoot } from "./containers/SwapVidPlayerRoot";
import { VideoCropper } from "./containers/VideoCropper";

export type TAppMode = "PoCUserStudy" | "SwapVid";

export default function App() {
  return (
    <div className="app-container relative bg-neutral-800 box-border z-0 h-screen flex-xyc flex-col px-4 pt-4">
      <ErrorBoundary>
        <SwapVidPlayerRoot zIndex={0} />
        <VideoCropper zIndex={10} />
        <PdfUplorder zIndex={10} />
        <LocalFilePicker zIndex={20} />
      </ErrorBoundary>

      <AppConfig zIndex={20} />
    </div>
  );
}
