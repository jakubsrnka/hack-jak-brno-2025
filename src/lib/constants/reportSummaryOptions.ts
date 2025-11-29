export interface ReportSummaryOption {
  id: string;
  label: string;
  defaultValue: boolean;
}

export const REPORT_SUMMARY_OPTIONS: ReportSummaryOption[] = [
  { id: 'diagnoseDate', label: 'Datum stanovení diagnózy', defaultValue: false },
  { id: 'tnmClassification', label: 'Klinická a patologická TNM klasifikace', defaultValue: false },
  {
    id: 'hormonalReceptors',
    label: 'Vyšetření hormonálních receptorů (ER, PR) a HER2',
    defaultValue: false
  },
  { id: 'treatmentOutsideOfMou', label: 'Léčba mimo MOÚ', defaultValue: false },
  { id: 'progression', label: 'Progrese', defaultValue: false },
  { id: 'distantMetastases', label: 'Recidiva a výskyt vzdálených metastáz', defaultValue: false }
];
