import { PDF_ANALYZER_API_ENDPOINT_WS } from "@/app.config";
import { useCallback, useEffect, useRef } from "react";

const PDF_ANALYZER_QUERY_SEP = "&";

const cmdToDispatch = {
  run: (assetId: string, i_page_start?: number, i_page_end?: number) => {
    const run = `run=${assetId}`;
    const page_start =
      i_page_start !== undefined ? `i_page_start=${i_page_start}` : "";
    const page_end = i_page_end !== undefined ? `i_page_end=${i_page_end}` : "";

    const cmdArray = [run, page_start, page_end].filter((cmd) => cmd !== "");
    const cmd = cmdArray.join(PDF_ANALYZER_QUERY_SEP);
    console.log("cmd:", cmd);

    return cmd;
  },

  close: () => "close",
};

export default function usePDFAnalyzer() {
  const wsRef = useRef<WebSocket | null>(null);

  const wsEventListenersRef = useRef<Map<string, EventListener>>(
    new Map<string, EventListener>()
  );

  const _initalize = useCallback(() => {
    const ws = wsRef.current as WebSocket;

    ws?.close();

    wsEventListenersRef.current.forEach((listener, eventName) => {
      ws.removeEventListener(eventName, listener);
    });

    wsRef.current = null;
    wsEventListenersRef.current.clear();
  }, [wsRef, wsEventListenersRef]);

  const parseProgressMessage = useCallback((msg: string) => {
    return msg.split("=")[1].replace("%", ""); // ex) 90
  }, []);

  const runPDFContentAnalysis = useCallback(
    async (
      assetId: string,
      onChannelClosed?: () => void,
      progressReceiver?: (progressPct: string) => void
    ) => {
      if (!wsRef.current) {
        console.log("Connecting to PDF Analyzer...");
        const ws = new WebSocket(PDF_ANALYZER_API_ENDPOINT_WS);
        const listeners = wsEventListenersRef.current;

        const handleOnOpen = () => {
          console.log("Start to analyze PDF.");
          ws.send(cmdToDispatch.run(assetId));
        };
        ws.onopen = handleOnOpen;
        listeners.set("onopen", handleOnOpen);

        /** Setting OnMessage handler */
        const handleOnMessage = (event: Event) => {
          const e = event as MessageEvent<string>;
          const currentMessage = e.data;

          console.log("【MSG RECEIVED】", currentMessage);

          if (currentMessage.includes("progress") && progressReceiver) {
            progressReceiver(parseProgressMessage(currentMessage));
          }

          if (currentMessage === "success") {
            ws.close();
          }

          if (currentMessage === "error") {
            ws.close();
          }
        };
        ws.onmessage = handleOnMessage;
        listeners.set("onmessage", handleOnMessage);

        /** Setting OnClose handler */
        const handleOnClose = () => {
          console.log("Connection closed. Initializing...");
          onChannelClosed && onChannelClosed();
          _initalize();
        };
        ws.onclose = handleOnClose;
        listeners.set("onclose", handleOnClose);
      }
    },
    [wsRef, wsRef.current, wsEventListenersRef, _initalize]
  );

  useEffect(() => {
    return () => {
      _initalize();
    };
  }, [_initalize]);

  return { runPDFContentAnalysis, parseProgressMessage };
}
