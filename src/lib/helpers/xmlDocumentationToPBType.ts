import type { XmlDocumentation } from '$types/xmlDocumentation';
import type { CreateBase, PatientRecordsRecord } from '$types/pocketbase';

export const extractPatientIdFromData = (data: XmlDocumentation): string => {
  const patientWrapper = data.dokumentace.children[0];
  return patientWrapper.pacient.id;
};

export const extractDocumentationRecords = (
  xmlDoc: XmlDocumentation,
  reportId: string
): CreateBase<PatientRecordsRecord>[] => {
  const patientWrapper = xmlDoc.dokumentace.children[0];
  return patientWrapper.pacient.children.flatMap((recordWrapper) => {
    const record = recordWrapper.zaznam;
    return record.children.map((rec) => ({
      text: rec.text!.content,
      type: rec.typ!.content,
      date: new Date(rec.datum!.content).toISOString().split('T')[0],
      report: reportId
    }));
  });
};
