import { CaseData, CaseResponse } from 'blaise-api-node-client';
import { mapCaseDetails, mapCaseFactsheet, mapEditorAllocationDetails } from '../../../server/mappers/caseMapper';
import { CaseDetails, CaseFactsheetDetails } from '../../../common/interfaces/caseInterface';
import { EditorAllocationDetails } from '../../../common/interfaces/surveyInterface';

describe('Map case report data to case details list', () => {
  it('It should return a correctly mapped list of cases', () => {
    // arrange
    const questionnaireName: string = 'OPN2201A';
    const externalWebUrl: string = 'cati.blaise.com';

    const caseDataList: CaseData[] = [
      {
        'qserial.serial_number': '9001',
        'qhadmin.hout': 110,
        'allocation.toeditor': 'rrice',
      },
      {
        'qserial.serial_number': '9002',
        'qhadmin.hout': 210,
        'allocation.toeditor': '',
      },
      {
        'qserial.serial_number': '9003',
        'qhadmin.hout': 0,
        'allocation.toeditor': 'bedgar',
      },
    ];

    const expectedCaseDetails:CaseDetails[] = [
      {
        CaseId: '9001',
        CaseStatus: 110,
        EditorAllocated: 'rrice',
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${9001}`,
      },
      {
        CaseId: '9002',
        CaseStatus: 210,
        EditorAllocated: '',
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${9002}`,
      },
      {
        CaseId: '9003',
        CaseStatus: 0,
        EditorAllocated: 'bedgar',
        EditCaseLink: `https://cati.blaise.com/${questionnaireName}?Mode=CAWI&KeyValue=${9003}`,
      },
    ];

    // act
    const result = mapCaseDetails(caseDataList, questionnaireName, externalWebUrl);

    // assert
    expect(result).toEqual(expectedCaseDetails);
  });
});

describe('Map case report data to Editor Allocation Details list', () => {
  it('It should return a correctly mapped list of editor allocation details', () => {
    // arrange
    const caseDataList: CaseData[] = [
      {
        'qserial.serial_number': '9001',
        'allocation.toeditor': 'toby',
      },
      {
        'qserial.serial_number': '9002',
        'allocation.toeditor': '',
      },
      {
        'qserial.serial_number': '9003',
        'allocation.toeditor': 'toby',
      },
      {
        'qserial.serial_number': '9004',
        'allocation.toeditor': 'jake',
      },
      {
        'qserial.serial_number': '9005',
        'allocation.toeditor': '       ',
      },
    ];

    const expectedAllocationDetails:EditorAllocationDetails[] = [{
      editor: 'toby',
      cases: ['9001', '9003'],
    },
    {
      editor: 'jake',
      cases: ['9004'],
    },
    ];

    // act
    const result = mapEditorAllocationDetails(caseDataList);

    // assert
    expect(result).toEqual(expectedAllocationDetails);
  });
});

describe('Map case response to factsheet', () => {
  it('It should return a correctly mapped factsheet withresponent(s)', () => {
    // arrange
    const CaseResponseData:CaseResponse = {
      caseId: '9001',
      fieldData: {
        'qiD.Serial_Number': '9001',
        'qDataBag.Prem1': 'Flat 1',
        'qDataBag.Prem2': 'Richmond House',
        'qDataBag.Prem3': 'Rice Road',
        'qDataBag.Prem4': 'Duffrin',
        'qDataBag.District': 'Gwent',
        'qDataBag.PostTown': 'Newport',
        'qDataBag.PostCode': 'NZ11 4PD',
        'qhAdmin.HOut': '110',
        'qhAdmin.Interviewer[1]': 'Rich',
        'dmName[1]': 'Richmond Ricecake',
        'dmDteOfBth[1]': '1980-01-15',
        'dmName[2]': 'Bartholomew Edgar',
        'dmDteOfBth[2]': '1995-06-11',
        dmhSize: '2',
      },
    };

    const expectedFactsheet:CaseFactsheetDetails = {
      CaseId: '9001',
      OutcomeCode: 110,
      InterviewerName: 'Rich',
      NumberOfRespondents: 2,
      Address: {
        AddressLine1: 'Flat 1',
        AddressLine2: 'Richmond House',
        AddressLine3: 'Rice Road',
        AddressLine4: 'Duffrin',
        County: 'Gwent',
        Town: 'Newport',
        Postcode: 'NZ11 4PD',
      },
      Respondents: [
        {
          RespondentName: 'Richmond Ricecake',
          DateOfBirth: new Date('1980-01-15'),
        },
        {
          RespondentName: 'Bartholomew Edgar',
          DateOfBirth: new Date('1995-06-11'),
        },
      ],
    };

    // act
    const result = mapCaseFactsheet(CaseResponseData);

    // assert
    expect(result).toEqual(expectedFactsheet);
  });

  it.each(['one', 'dyhzjsgfkb'])('It should error when household size can not be converted into a number', (value) => {
    // arrange
    const CaseResponseData:CaseResponse = {
      caseId: '9001',
      fieldData: {
        'qiD.Serial_Number': '9001',
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
    expect(() => mapCaseFactsheet(CaseResponseData)).toThrowError('Number of responents not specified');
  });

  it.each(['0', '', ' '])('It should error when household Size is missing or zero', (value) => {
    // arrange
    const CaseResponseData:CaseResponse = {
      caseId: '9001',
      fieldData: {
        'qiD.Serial_Number': '9001',
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
    expect(() => mapCaseFactsheet(CaseResponseData)).toThrowError('Number of responents not specified');
  });
});
