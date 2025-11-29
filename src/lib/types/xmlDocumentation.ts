export interface ContentElement {
  content: string;
}

export interface Record {
  children: Array<{
    datum?: ContentElement;
    typ?: ContentElement;
    text?: ContentElement;
  }>;
}

export interface RecordWrapper {
  zaznam: Record;
}

export interface Patient {
  id: string;
  children: RecordWrapper[];
}

export interface PatientWrapper {
  pacient: Patient;
}

export interface Documentation {
  children: PatientWrapper[];
}

export interface XmlDocumentation {
  dokumentace: Documentation;
}
