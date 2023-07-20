import { ICaseStatus, Outcome } from 'blaise-api-node-client';
import { ICaseDetails } from '../../../server/interfaces/case.details.interface';
import mapCaseDetails from '../../../server/mappers/case.details.mapper';

describe('Map case status list to case details list', () => {
  it('It should return a correctly mapped list of cases', () => {
    // arrange
    const questionnaireName: string = 'TEST111A';
    const externalWebUrl: string = 'cati.blaise.com';

    const caseStatusList: ICaseStatus[] = [
      {
        primaryKey: '1',
        outcome: Outcome.Completed,
      },
      {
        primaryKey: '2',
        outcome: Outcome.Partial,
      },
      {
        primaryKey: '3',
        outcome: Outcome.AppointmentMade,
      },
    ];

    const expectedCasesList: ICaseDetails[] = [
      {
        CaseId: '1',
        CaseStatus: Outcome.Completed,
        CaseLink: `https://${externalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=1`,
      },
      {
        CaseId: '2',
        CaseStatus: Outcome.Partial,
        CaseLink: `https://${externalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=2`,
      },
      {
        CaseId: '3',
        CaseStatus: Outcome.AppointmentMade,
        CaseLink: `https://${externalWebUrl}/${questionnaireName}?Mode=CAWI&KeyValue=3`,
      },
    ];

    // act
    const result = mapCaseDetails(caseStatusList, questionnaireName, externalWebUrl);

    // assert
    expect(result).toEqual(expectedCasesList);
  });
});
