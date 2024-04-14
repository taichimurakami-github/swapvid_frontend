import { TBoundingBox } from "./swapvid";

export type RequestProtocol = "ws" | "http" | "https";

export type CmdProtocolPdfAnalyzerApi = "inline" | "json";

export type FileExplorerAPIResponse = {
  pdf_files: string[];
  index_files: string[];
};

export type SequenceAnalyzerOkResponseBody = {
  document_available: boolean;
  estimated_viewport: TBoundingBox | null;
  matched_content_vf: string | null;
  matched_content_doc: string | null;
  score_ngram: number;
  score_sqmatch: number;
};

// content_sequence_matched: boolean,
// content_matching_result TBoundingBox | None,
// document_available: boolean,
// viewport_estimation_result: TBoundingBox | None,

export type SequenceAnalyzerErrorResponseBody = {
  document_available: boolean;
  estimated_viewport: TBoundingBox | null;
  matched_content_vf: string | null;
  matched_content_doc: string | null;
  score_ngram: number;
  score_sqmatch: number;
  error_type: string;
  error_message: string;
};

export type MatchContentSequenceResult =
  | {
      status: "OK";
      bodyContent: SequenceAnalyzerOkResponseBody;
    }
  | {
      status: "ERROR";
      bodyContent: SequenceAnalyzerErrorResponseBody;
    };
