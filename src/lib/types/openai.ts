export type KeyPart = {
  importance: 1 | 2 | 3;
  position: { start: number; end: number };
  reason: string;
};

export type Record = {
  id: string;
  summary: string; // eventually remove if is not reliable
  keyParts: KeyPart[];
};

export type Report = {
  id: string;
  summary: string;
  records: Record[];
};
