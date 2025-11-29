export type KeyPart = {
  importance: 1 | 2 | 3;
  citations: string[];
  reason: string;
  types: string[];
};

export type RecordAIData = {
  id: string;
  summary: string; // eventually remove if is not reliable
  keyParts: KeyPart[];
};

export type ReportSummaryResponse = {
  shortSummary: string;
  summary: string;
};

export type AIResponse = {
  shortSummary: string;
  summary: string;
  records: RecordAIData[];
};
