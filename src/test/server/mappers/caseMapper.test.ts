import { CaseResponse } from 'blaise-api-node-client';
import { mapCaseDetails, mapCaseFactsheet } from '../../../server/mappers/caseMapper';
import {
  caseDetailsListMockObject, caseFactsheetMockObject, caseResponseMockObject, caseStatusListMockObject,
} from '../../mockObjects/caseMockObject';

describe('Map case status list to case details list', () => {
  it('It should return a correctly mapped list of cases', () => {
    // arrange
    const questionnaireName: string = 'OPN2201A';
    const externalWebUrl: string = 'cati.blaise.com';

    // act
    const result = mapCaseDetails(caseStatusListMockObject, questionnaireName, externalWebUrl);

    // assert
    expect(result).toEqual(caseDetailsListMockObject);
  });
});

describe('Map case response to factsheet', () => {
  it('It should return a correctly mapped factsheet withresponent(s)', () => {
    // arrange

    // act
    const result = mapCaseFactsheet(caseResponseMockObject);

    // assert
    expect(result).toEqual(caseFactsheetMockObject);
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
