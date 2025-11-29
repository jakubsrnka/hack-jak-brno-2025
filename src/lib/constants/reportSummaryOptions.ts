export interface ReportSummaryOption {
  id: number;
  label: string;
}

export const REPORT_SUMMARY_OPTIONS: ReportSummaryOption[] = [
  { id: 1, label: 'Datum stanovení diagnózy' },
  { id: 2, label: 'Klinická a patologická TNM klasifikace' },
  {
    id: 3,
    label: 'Vyšetření hormonálních receptorů (ER, PR) a HER2'
  },
  { id: 4, label: 'Léčba mimo MOÚ' },
  { id: 5, label: 'Progrese' },
  { id: 6, label: 'Recidiva a výskyt vzdálených metastáz' }
];
