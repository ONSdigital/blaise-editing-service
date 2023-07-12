import axios from 'axios';
import { ICaseStatus, IQuestionnaire, Outcome } from 'blaise-api-node-client';
import { ICaseDetails } from '../../server/interfaces/case.details.interface';

export async function getQuestionnaires(): Promise<IQuestionnaire[]> {
  const response = await axios.get('/api/questionnaires');
  return response.data;
}

export async function getStatusOfCases(questionnaireName: string): Promise<ICaseStatus[]> {
  const response = await axios.get(`/api/questionnaires/${questionnaireName}/cases/status`);
  return response.data;
}

export async function getListOfCases(questionnaireName: string): Promise<ICaseDetails[]> {
  // const response = await axios.get(`/api/questionnaires/${questionnaireName}/cases/status`);
  const mockResponseData = [
    {
      CaseId: '1',
      CaseStatus: Outcome.Completed,
      CaseLink: `https://dev-cati.social-surveys.gcp.onsdigital.uk/${questionnaireName}`,
    },
    {
      CaseId: '2',
      CaseStatus: Outcome.NonContact,
      CaseLink: `https://dev-cati.social-surveys.gcp.onsdigital.uk/${questionnaireName}`,
    },
    {
      CaseId: '3',
      CaseStatus: Outcome.HardRefusal,
      CaseLink: `https://dev-cati.social-surveys.gcp.onsdigital.uk/${questionnaireName}`,
    },
  ];

  const mockData = await Promise.resolve(mockResponseData);

  return mockData;
}
