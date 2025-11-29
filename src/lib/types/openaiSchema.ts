export type Report = {
  id: string;
  summary: string;
  records: {
    id: string;
    summary: string; // eventually remove if is not reliable
    keyParts: {
      importance: 1 | 2 | 3;
      position: { start: number; end: number };
      reason: string;
    }[];
  }[];
};
