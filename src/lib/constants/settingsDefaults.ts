export interface SearchKey {
  id: number;
  key: string;
}

export const defaultSearchKeys: SearchKey[] = [
  { id: 1, key: 'Datum stanovení diagnózy' },
  { id: 2, key: 'Klinická a patologická TNM klasifikace' },
  { id: 3, key: 'Vyšetření hormonálních receptorů (ER, PR) a HER2' },
  { id: 4, key: 'Léčba mimo MOÚ' },
  { id: 5, key: 'Progrese' },
  { id: 6, key: 'Recidiva a výskyt vzdálených metastáz' }
];
