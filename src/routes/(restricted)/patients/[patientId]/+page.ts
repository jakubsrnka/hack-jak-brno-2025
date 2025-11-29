import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  console.log('Params in load function:', params.patientId);
  return {
    patientId: params.patientId
  };
};
