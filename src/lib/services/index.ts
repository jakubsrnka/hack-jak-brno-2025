import { pbClient } from '$lib/pocketbase';
import type { KeyPart } from '$types/openai';
import {
  Collections,
  type CreateBase,
  type PatientRecordsRecord,
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
  const filterConditions = doctorIds.map((id) => `doctor ~ "${id}"`).join(' || ');
  return pbClient
    .collection(Collections.Patients)
    .getFullList<PatientsResponse>({ filter: filterConditions });
};

export const getPatientReports = async (patientId: string): Promise<PatientReportsResponse[]> => {
  return pbClient
    .collection(Collections.PatientReports)
    .getFullList<PatientReportsResponse>({ filter: `patient="${patientId}"` });
};

export const getPatientRecords = async (reportId: string): Promise<PatientRecordsResponse[]> => {
  return pbClient
    .collection(Collections.PatientRecords)
    .getFullList<PatientRecordsResponse>({ filter: `report="${reportId}"` });
};

export const insertPatient = async (patientId: string): Promise<PatientsResponse> => {
  const collection = pbClient.collection(Collections.Patients);
  const currentDoctorId = pbClient.authStore.record?.id;

  if (!currentDoctorId) {
    throw new Error('No authenticated user found');
  }

  const list = await collection.getList(1, 1, { filter: `uuid="${patientId}"` });

  if (list.items?.length) {
    const patient = list.items[0] as unknown as PatientsResponse;

    // Check if current doctor is already assigned to this patient
    if (!patient.doctor.includes(currentDoctorId)) {
      // Add current doctor to the patient's doctor array
      const updatedPatient = await collection.update(patient.id, {
        doctor: [...patient.doctor, currentDoctorId]
      });
      return updatedPatient as PatientsResponse;
    }

    return patient;
  }

  // Patient doesn't exist, create with current doctor assigned
  const created = await collection.create({
    uuid: patientId,
    doctor: [currentDoctorId]
  });
  return created as PatientsResponse;
};

export const createEmptyReport = async (patientId: string) => {
  const collection = pbClient.collection(Collections.PatientReports);
  const created = await collection.create({
    patient: patientId
  });
  return created as PatientReportsResponse;
};

export const createRecords = async (
  reportId: string,
  records: CreateBase<PatientRecordsRecord>[]
): Promise<PatientRecordsResponse[]> => {
  const collection = pbClient.collection(Collections.PatientRecords);

  console.log(records);

  const createdRecords = await Promise.all(
    records.map((record) =>
      collection.create(
        {
          ...record,
          report: reportId
        },
        { requestKey: null }
      )
    )
  );

  return createdRecords as PatientRecordsResponse[];
};

export const updateUserSettings = async (settings: Record<string, unknown>) => {
  const currentUserId = pbClient.authStore.record?.id;

  if (!currentUserId) {
    throw new Error('No authenticated user found');
  }

  return await pbClient.collection(Collections.Users).update(currentUserId, {
    settings
  });
};
