import { pbClient } from '$lib/pocketbase';
import type { KeyPart } from '$types/openai';
import {
  Collections,
  type PatientRecordsResponse,
  type PatientReportsResponse,
  type PatientsResponse
} from '$types/pocketbase';

export const getPatientReport = async (
  id: string
): Promise<
  PatientReportsResponse<{
    patientRecords_via_report: PatientRecordsResponse<KeyPart[]>[];
  }>
> =>
  pbClient.collection(Collections.PatientReports).getOne(id, {
    expand: 'patientRecords_via_report'
  });

export const getPatientsByDoctor = async (doctorIds: string[]): Promise<PatientsResponse[]> => {
  const filterConditions = doctorIds.map(id => `doctor ~ "${id}"`).join(' || ');
  return pbClient
    .collection(Collections.Patients)
    .getFullList<PatientsResponse>({ filter: filterConditions });
};