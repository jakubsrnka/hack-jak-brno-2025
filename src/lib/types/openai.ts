export type KeyPart = {
  importance: 1 | 2 | 3;
  citation: string;
  reason: string;
  type: string[];
};

export type RecordAIData = {
  id: string;
  summary: string; // eventually remove if is not reliable
  keyParts: KeyPart[];
};

export type AIResponse = {
  summary: string;
  records: RecordAIData[];
};
