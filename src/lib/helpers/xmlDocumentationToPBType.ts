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
    const dateStr = new Date(record.children[0].datum!.content).toISOString().split('T')[0];
    return {
      text: `${record.children[2].text!.content}\n\nDatum stanovení diagnózy: ${dateStr}`,
      type: record.children[1].typ!.content,
      date: dateStr,
      report: reportId
    };
  });
};
