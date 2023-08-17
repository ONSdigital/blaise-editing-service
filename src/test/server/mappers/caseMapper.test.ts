import { CaseResponse } from 'blaise-api-node-client';
import { CaseFactsheetDetails } from '../../../common/interfaces/caseInterface';
import { mapCaseDetails, mapCaseFactsheet } from '../../../server/mappers/caseMapper';
import CaseBuilder from '../../builders/caseBuilder';
import CaseDetailsBuilder from '../../builders/caseDetailsBuilder';

describe('Map case status list to case details list', () => {
  it.each([1, 2, 3, 4])('It should return a correctly mapped list of cases', (value) => {
    // arrange
    const questionnaireName: string = 'OPN2201A';
    const externalWebUrl: string = 'cati.blaise.com';

    const caseDetailsBuider = new CaseDetailsBuilder(value);
    const expectedCasesList = caseDetailsBuider.BuildCaseDetails();
    const caseStatusList = caseDetailsBuider.BuildCaseStatus();

    // act
    const result = mapCaseDetails(caseStatusList, questionnaireName, externalWebUrl);

    // assert
    expect(result).toEqual(expectedCasesList);
  });
});

describe('Map case response to factsheet', () => {
  it.each([1, 3, 5, 10])('It should return a correctly mapped factsheet with x responent(s)', (value) => {
    // arrange
    const caseBuilder = new CaseBuilder(value);
    const CaseResponseMockObject: CaseResponse = caseBuilder.buildCaseResponse();
    const expectedCaseFactsheet: CaseFactsheetDetails = caseBuilder.buildCaseFactsheet();

    // act
    const result = mapCaseFactsheet(CaseResponseMockObject);

    // assert
    expect(result).toEqual(expectedCaseFactsheet);
  });

  it.each(['one', 'dyhzjsgfkb'])('It should error when household size can not be converted into a number', (value) => {
    // arrange
    const CaseResponseMockObject:CaseResponse = {
      caseId: '1',
      fieldData: {
        'qiD.Serial_Number': '1',
        'qDataBag.Prem1': 'Flat 1',
        'qDataBag.Prem2': 'Richmond House',
        'qDataBag.Prem3': 'Rice Road',
        'qDataBag.Prem4': '',
        'qDataBag.District': 'Gwent',
        'qDataBag.PostTown': 'Newport',
        'qDataBag.PostCode': 'NZ11 4PD',
        'qhAdmin.HOut': '100',
        'qhAdmin.Interviewer[1]': 'rich',
        'dmName[1]': 'Richmond Ricecake',
        'dmDteOfBth[1]': '1980-01-15',
        dmhSize: `${value}`,
      },
    };

    // act && assert
    expect(() => mapCaseFactsheet(CaseResponseMockObject)).toThrowError('Number of responents not specified');
  });

  it.each(['0', '', ' '])('It should error when household Size is missing or zero', (value) => {
    // arrange
    const CaseResponseMockObject:CaseResponse = {
      caseId: '1',
      fieldData: {
        'qiD.Serial_Number': '1',
        'qDataBag.Prem1': 'Flat 1',
        'qDataBag.Prem2': 'Richmond House',
        'qDataBag.Prem3': 'Rice Road',
        'qDataBag.Prem4': '',
        'qDataBag.District': 'Gwent',
        'qDataBag.PostTown': 'Newport',
        'qDataBag.PostCode': 'NZ11 4PD',
        'qhAdmin.HOut': '100',
        'qhAdmin.Interviewer[1]': 'rich',
        'dmName[1]': 'Richmond Ricecake',
        'dmDteOfBth[1]': '1980-01-15',
        dmhSize: `${value}`,
      },
    };

    // act && assert
    expect(() => mapCaseFactsheet(CaseResponseMockObject)).toThrowError('Number of responents not specified');
  });
});
