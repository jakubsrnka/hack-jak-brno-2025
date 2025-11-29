import { pbClient } from '$lib/pocketbase';
import type { KeyPart } from '$types/openai';
import { Collections, type PatientRecordsResponse } from '$types/pocketbase';

export const getPatientReport = async (
  id: string
): Promise<
  PatientRecordsResponse<{
    patientRecords_via_report: PatientRecordsResponse<KeyPart[]>;
  }>
> =>
  pbClient.collection(Collections.PatientReports).getOne(id, {
    expand: 'patientRecords_via_report'
  });
