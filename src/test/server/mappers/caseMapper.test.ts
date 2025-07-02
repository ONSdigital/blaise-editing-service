import {
  describe, beforeEach, it, vi,
} from 'vitest';
import { CaseResponse } from 'blaise-api-node-client';
import { caseResponseMockObject } from '../mockObjects/CaseMockObject';
import { CaseSummaryDetails, HousingBenefits } from '../../../common/interfaces/caseInterface';
import mapCaseSummary from '../../../server/mappers/caseMapper';

function SetFieldsToValue(CaseResponseData: CaseResponse, fieldEndsWith: string, fieldValue: string): void {
  Object.keys(CaseResponseData.fieldData).forEach((key) => {
    if (key.endsWith(fieldEndsWith)) {
      CaseResponseData.fieldData[key] = fieldValue;
    }
  });
}

let caseResponseData: CaseResponse;

describe('Map case response to case summary', () => {
  beforeEach(() => {
    vi.resetModules();
    caseResponseData = JSON.parse(JSON.stringify(caseResponseMockObject));
  });

  it('It should return a correctly mapped summary with responent(s)', () => {
    // arrange
    const inputCaseResponseData: CaseResponse = {
      caseId: '9001',
      fieldData: {
        'qiD.Serial_Number': '9001',
        'qSignIn.StartDat': '2024-05-11',
        'qDataBag.District': 'Gwent',
        'qhAdmin.HOut': '110',
        'qhAdmin.QObsSheet.MainAcD': '1',
        'qhAdmin.QObsSheet.TypAcDV': '1',
        'qhAdmin.QObsSheet.FloorN': '2',
        'qhAdmin.Interviewer[1]': 'Rich',
        'qAccomdat.HHStat': '1',
        'qAccomdat.Bedroom': '2',
        'bU[1].QBenefit.QBenef2[1].HBenAmt': '380',
        'bU[1].QBenefit.QBenef2[1].HBenPd': '1',
        'QCounTax.CTBand': '1',
        'BU[1].QBUId.BUNum': '1',
        'BU[1].QSelfJob[1].Adult[1].BusRoom': '1',
        'BU[1].QCurst1.Adult[1].EmpStat': '2',
        'BU[1].QCurst1.Adult[1].Persid': '1',
        'BU[1].QCurst1.Adult[2].EmpStat': '2',
        'BU[1].QCurst1.Adult[2].Persid': '2',
        'BU[1].QBenefit.QWageBen.Adult[1].WageBen[1]': '5',
        'BU[1].QBenefit.QWageBen.Adult[1].Persid': '1',
        'BU[1].QBenefit.QWageBen.Adult[1].JSAType': '2',
        dmhSize: '2', // 'hhsize' in B4, check with BDSS?
        'dmName[1]': 'Richmond Ricecake', // `QNames.M[1].Name` in B4, check with BDSS?
        'qHousehold.QHHold.Person[1].BenUnit': '1',
        'qHousehold.QHHold.Person[1].Sex': '1',
        'qHousehold.QHHold.Person[1].DoB': '1980-01-15', // 'hhg.P[1].DoB' in B4, check with BDSS?
        'qHousehold.QHHold.Person[1].livewith': '1',
        'qHousehold.QHHold.Person[1].QRel[1].R': '97',
        'qHousehold.QHHold.Person[1].QRel[2].R': '1',
        'dmName[2]': 'Betty Bettison', // `QNames.M[2].Name` in B4, check with BDSS?
        'qHousehold.QHHold.Person[2].BenUnit': '1',
        'qHousehold.QHHold.Person[2].Sex': '2',
        'qHousehold.QHHold.Person[2].DoB': '1995-06-11', // 'hhg.P[2].DoB' in B4, check with BDSS?
        'qHousehold.QHHold.Person[2].livewith': '1',
        'qHousehold.QHHold.Person[2].QRel[1].R': '1',
        'qHousehold.QHHold.Person[2].QRel[2].R': '97',
      },
    };

    const expectedSummaryDetails: CaseSummaryDetails = {
      CaseId: '9001',
      OutcomeCode: '110',
      InterviewDate: new Date('11-05-2024'),
      District: 'Gwent',
      InterviewerName: 'Rich',
      NumberOfRespondents: '2',
      Household: {
        Accommodation: {
          Main: 'House/Bungalow',
          Type: 'Detached',
        },
        FloorNumber: '2',
        Status: 'Conventional',
        NumberOfBedrooms: '2',
        ReceiptOfHousingBenefit: [{
          Amount: '380',
          PeriodCode: 'One week',
        }],
        CouncilTaxBand: 'Band A',
        BusinessRoom: true,
        SelfEmployed: true,
        SelfEmployedMembers: ['1', '2'],
        IncomeSupport: true,
        IncomeSupportMembers: ['1'],
        IncomeBasedJaSupport: true,
        IncomeBasedJaSupportMembers: ['1'],
      },
      Respondents: [
        {
          PersonNumber: '1',
          RespondentName: 'Richmond Ricecake',
          BenefitUnit: '1',
          Sex: 'M',
          DateOfBirth: new Date('1980-01-15'),
          MaritalStatus: 'COH',
          Relationship: ['*', '1'],
        },
        {
          PersonNumber: '2',
          RespondentName: 'Betty Bettison',
          BenefitUnit: '1',
          Sex: 'F',
          DateOfBirth: new Date('1995-06-11'),
          MaritalStatus: 'COH',
          Relationship: ['1', '*'],
        },
      ],
    };

    // act
    const result = mapCaseSummary(inputCaseResponseData);

    // assert
    expect(result).toEqual(expectedSummaryDetails);
  });

  it.each(['one', 'dyhzjsgfkb'])('It should error when household size can not be converted into a number', (value) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    caseResponseData.fieldData[''] = value;

    // act && assert
    expect(() => mapCaseSummary(caseResponseData)).toThrowError('Number of responents not specified');
  });

  it.each(['0', '', ' '])('It should error when household Size is missing or zero', (value) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    caseResponseData.fieldData['dmhSize'] = value;

    // act && assert
    expect(() => mapCaseSummary(caseResponseData)).toThrowError('Number of responents not specified');
  });

  it.each([
    ['1', 'House/Bungalow'],
    ['2', 'Flat/Maisonette'],
    ['3', 'Room/Rooms'],
    ['4', 'Other'],
    ['5', 'N/A'],
  ])('It should return the expected Accomadation Main when given valid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'qhAdmin.QObsSheet.MainAcD', '');
    caseResponseData.fieldData['qhAdmin.QObsSheet.MainAcD'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.Accommodation.Main).toEqual(expectedOutputValue);
  });

  it.each([
    ['0', '-'],
    ['6', '-'],
    ['', '-'],
    ['test', '-'],
  ])('It should return the expected Accomadation Main when given invalid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'qhAdmin.QObsSheet.MainAcD', '');
    caseResponseData.fieldData['qhAdmin.QObsSheet.MainAcD'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.Accommodation.Main).toEqual(expectedOutputValue);
  });

  it.each([
    ['1', 'Detached'],
    ['2', 'S-Detached'],
    ['3', 'Terrace'],
    ['4', 'Purp-Built'],
    ['5', 'Converted'],
    ['6', 'Mobile Home'],
    ['7', 'Other Kind'],
    ['8', 'N/A'],
  ])('It should return the expected Accomadation Type when given valid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'qhAdmin.QObsSheet.TypAcDV', '');
    caseResponseData.fieldData['qhAdmin.QObsSheet.TypAcDV'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.Accommodation.Type).toEqual(expectedOutputValue);
  });

  it.each([
    ['0', '-'],
    ['9', '-'],
    ['', '-'],
    ['test', '-'],
  ])('It should return the expected Accomadation Type when given invalid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'qhAdmin.QObsSheet.TypAcDV', '');
    caseResponseData.fieldData['qhAdmin.QObsSheet.TypAcDV'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.Accommodation.Type).toEqual(expectedOutputValue);
  });

  it.each([
    ['1', 'Conventional'],
    ['2', 'Shared'],
    ['3', 'N/A'],
  ])('It should return the expected HouseStatus when given valid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'qAccomdat.HHStat', '');
    caseResponseData.fieldData['qAccomdat.HHStat'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.Status).toEqual(expectedOutputValue);
  });

  it.each([
    ['0', ''],
    ['4', ''],
    ['', ''],
    ['test', ''],
  ])('It should return the expected HouseStatus when given invalid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'qAccomdat.HHStat', '');
    caseResponseData.fieldData['qAccomdat.HHStat'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.Status).toEqual(expectedOutputValue);
  });

  it.each([
    ['1', 'Band A'],
    ['2', 'Band B'],
    ['3', 'Band C'],
    ['4', 'Band D'],
    ['5', 'Band E'],
    ['6', 'Band F'],
    ['7', 'Band G'],
    ['8', 'Band H'],
    ['9', 'Band I'],
    ['10', 'Band J'],
  ])('It should return the expected CouncilTaxBand when given valid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'QCounTax.CTBand', '');
    caseResponseData.fieldData['QCounTax.CTBand'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.CouncilTaxBand).toEqual(expectedOutputValue);
  });

  it.each([
    ['0', 'Blank'],
    ['11', 'Blank'],
    ['', 'Blank'],
    ['test', 'Blank'],
  ])('It should return the expected CouncilTaxBand when given invalid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'QCounTax.CTBand', '');
    caseResponseData.fieldData['QCounTax.CTBand'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.CouncilTaxBand).toEqual(expectedOutputValue);
  });

  it.each([
    ['1', 'One week'],
    ['2', 'Two weeks'],
    ['3', 'Three weeks'],
    ['4', 'Four weeks'],
    ['5', 'calendar month'],
    ['7', 'Two calendar months'],
    ['8', 'Eight times a year'],
    ['9', 'Nine times a year'],
    ['10', 'Ten times a year'],
    ['13', 'Three months/13 weeks'],
    ['24', 'Twice a month'],
    ['26', 'Six months/26 weeks'],
    ['52', 'One year/12 months/52 weeks'],
    ['90', 'Less than one week'],
    ['95', 'One off/lump sum'],
    ['97', 'Unknown'],
  ])('It should return the expected ReceiptOfHousingBenefit when only one person has this set', (PeriodCodeInput: string, expectedPeriodCode: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, '.HBenAmt', '');
    SetFieldsToValue(caseResponseData, '.HBenPd', '');

    const expectedHousingBenefit = '400';

    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenAmt'] = expectedHousingBenefit;
    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenPd'] = PeriodCodeInput;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.ReceiptOfHousingBenefit).toEqual([{
      Amount: expectedHousingBenefit,
      PeriodCode: expectedPeriodCode,
    }]);
  });

  it('It should return the expected ReceiptOfHousingBenefit when nobody has this set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.HBenAmt', '');
    SetFieldsToValue(caseResponseData, '.HBenPd', '');

    const expectedHousingBenefit: HousingBenefits[] = [{
      Amount: 'N/A',
      PeriodCode: 'N/A',
    }];

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.ReceiptOfHousingBenefit).toEqual(expectedHousingBenefit);
  });

  it.each([
    ['0', ''],
    ['98', ''],
    ['', ''],
    ['test', ''],
  ])('It should return the expected PeriodCode when given an invalid input for only one person', (PeriodCodeInput: string, expectedPeriodCode: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, '.HBenAmt', '');
    SetFieldsToValue(caseResponseData, '.HBenPd', '');

    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenAmt'] = '380';
    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenPd'] = PeriodCodeInput;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.ReceiptOfHousingBenefit).toEqual([{
      Amount: '380',
      PeriodCode: expectedPeriodCode,
    }]);
  });

  it('It should return the expected ReceiptOfHousingBenefit when Multiple person have this set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.HBenAmt', '');
    SetFieldsToValue(caseResponseData, '.HBenPd', '');

    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenAmt'] = '380';
    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenPd'] = '1';

    caseResponseData.fieldData['bU[2].QBenefit.QBenef2[2].HBenAmt'] = '390';
    caseResponseData.fieldData['bU[2].QBenefit.QBenef2[2].HBenPd'] = '5';

    caseResponseData.fieldData['bU[3].QBenefit.QBenef2[1].HBenAmt'] = '400';
    caseResponseData.fieldData['bU[3].QBenefit.QBenef2[1].HBenPd'] = '26';

    const expectedHousingBenefit: HousingBenefits[] = [{
      Amount: '380',
      PeriodCode: 'One week',
    },
    {
      Amount: '390',
      PeriodCode: 'calendar month',
    },
    {
      Amount: '400',
      PeriodCode: 'Six months/26 weeks',
    }];

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.ReceiptOfHousingBenefit).toEqual(expectedHousingBenefit);
  });

  it('It should return the the first 6 characters for ReceiptOfHousingBenefit when the input is longer than 6', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.HBenAmt', '');
    SetFieldsToValue(caseResponseData, '.HBenPd', '');

    const inputHousingBenefit = '1234567';
    const expectedHousingBenefit = '123456';

    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenAmt'] = inputHousingBenefit;
    caseResponseData.fieldData['bU[1].QBenefit.QBenef2[1].HBenPd'] = '1';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.ReceiptOfHousingBenefit).toEqual([{
      Amount: expectedHousingBenefit,
      PeriodCode: 'One week',
    }]);
  });

  it.each([
    ['1', '1', '1'],
    ['3', '2', '2'],
    ['5', '3', '1'],
    ['7', '4', '2'],
  ])('It should return true for BusinessRoom when it is set for any person', (benefitUnitToSet: string, selfEmployedToSet: string, adultToSet: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.BusRoom', '');

    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBUId.BUNum`] = '1';
    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QSelfJob[${selfEmployedToSet}].Adult[${adultToSet}].BusRoom`] = '1';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.BusinessRoom).toEqual(true);
  });

  it('It should return false for BusinessRoom when it is not set for any person', () => {
    // arrange

    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.BusRoom', '');

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.BusinessRoom).toEqual(false);
  });

  it.each([
    ['1', '1', '1'],
    ['4', '2', '8'],
    ['7', '1', '13'],
  ])('It should return true for SelfEmployed with a list of self employed members when there is only one set', (benefitUnitToSet: string, adultToSet: string, personIdToSet: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.EmpStat', '');
    SetFieldsToValue(caseResponseData, '.Persid', '');

    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBUId.BUNum`] = '1';
    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QCurst1.Adult[${adultToSet}].EmpStat`] = '2';
    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QCurst1.Adult[${adultToSet}].Persid`] = `${personIdToSet}`;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.SelfEmployed).toEqual(true);
    expect(result.Household.SelfEmployedMembers).toEqual([personIdToSet]);
  });

  it('It should return true for SelfEmployed with a list of self employed members when there are multiple set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.EmpStat', '');
    SetFieldsToValue(caseResponseData, '.Persid', '');

    caseResponseData.fieldData['BU[1].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[1].QCurst1.Adult[1].EmpStat'] = '2';
    caseResponseData.fieldData['BU[1].QCurst1.Adult[1].Persid'] = '1';

    caseResponseData.fieldData['BU[4].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[4].QCurst1.Adult[2].EmpStat'] = '2';
    caseResponseData.fieldData['BU[4].QCurst1.Adult[2].Persid'] = '8';

    caseResponseData.fieldData['BU[7].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[7].QCurst1.Adult[1].EmpStat'] = '2';
    caseResponseData.fieldData['BU[7].QCurst1.Adult[1].Persid'] = '13';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.SelfEmployed).toEqual(true);
    expect(result.Household.SelfEmployedMembers).toEqual(['1', '8', '13']);
  });

  it('It should return false for SelfEmployed with an empty list when there are none set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.EmpStat', '');
    SetFieldsToValue(caseResponseData, '.Persid', '');

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.SelfEmployed).toEqual(false);
    expect(result.Household.SelfEmployedMembers).toEqual([]);
  });

  it.each([
    ['1', '1', '1', '1'],
    ['4', '2', '6', '8'],
    ['7', '1', '10', '13'],
  ])('It should return true for IncomeSupport with a list of income support members when there is only one set', (benefitUnitToSet: string, adultToSet: string, wageBenefitToSet: string, personIdToSet: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    for (let wageBenefit = 1; wageBenefit <= 10; wageBenefit += 1) {
      SetFieldsToValue(caseResponseData, `.WageBen[${wageBenefit}]`, '');
    }
    SetFieldsToValue(caseResponseData, '.Persid', '');

    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBUId.BUNum`] = '1';
    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBenefit.QWageBen.Adult[${adultToSet}].WageBen[${wageBenefitToSet}]`] = '5';
    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBenefit.QWageBen.Adult[${adultToSet}].Persid`] = `${personIdToSet}`;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.IncomeSupport).toEqual(true);
    expect(result.Household.IncomeSupportMembers).toEqual([personIdToSet]);
  });

  it('It should return true for IncomeSupport with a list of income support members when there are multiple set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    for (let wageBenefit = 1; wageBenefit <= 10; wageBenefit += 1) {
      SetFieldsToValue(caseResponseData, `.WageBen[${wageBenefit}]`, '');
    }
    SetFieldsToValue(caseResponseData, '.Persid', '');

    caseResponseData.fieldData['BU[1].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[1].QBenefit.QWageBen.Adult[1].WageBen[1]'] = '5';
    caseResponseData.fieldData['BU[1].QBenefit.QWageBen.Adult[1].Persid'] = '1';

    caseResponseData.fieldData['BU[4].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[4].QBenefit.QWageBen.Adult[2].WageBen[6]'] = '5';
    caseResponseData.fieldData['BU[4].QBenefit.QWageBen.Adult[2].Persid'] = '8';

    caseResponseData.fieldData['BU[7].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[7].QBenefit.QWageBen.Adult[1].WageBen[10]'] = '5';
    caseResponseData.fieldData['BU[7].QBenefit.QWageBen.Adult[1].Persid'] = '13';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.IncomeSupport).toEqual(true);
    expect(result.Household.IncomeSupportMembers).toEqual(['1', '8', '13']);
  });

  it('It should return false for IncomeSupport with an empty list when there are none set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    for (let wageBenefit = 1; wageBenefit <= 10; wageBenefit += 1) {
      SetFieldsToValue(caseResponseData, `.WageBen[${wageBenefit}]`, '');
    }
    SetFieldsToValue(caseResponseData, '.Persid', '');

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.IncomeSupport).toEqual(false);
    expect(result.Household.IncomeSupportMembers).toEqual([]);
  });

  it.each([
    ['1', '1', '2', '1'],
    ['4', '2', '3', '8'],
    ['7', '1', '2', '13'],
  ])('It should return true for IncomeBasedJaSupport with a list of income based Ja members when there is only one set', (benefitUnitToSet: string, adultToSet: string, JsaTypeToSet: string, personIdToSet: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.JSAType', '');
    SetFieldsToValue(caseResponseData, '.Persid', '');

    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBUId.BUNum`] = '1';
    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBenefit.QWageBen.Adult[${adultToSet}].JSAType`] = `${JsaTypeToSet}`;
    caseResponseData.fieldData[`BU[${benefitUnitToSet}].QBenefit.QWageBen.Adult[${adultToSet}].Persid`] = `${personIdToSet}`;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.IncomeBasedJaSupport).toEqual(true);
    expect(result.Household.IncomeBasedJaSupportMembers).toEqual([personIdToSet]);
  });

  it('It should return true for IncomeBasedJaSupport with a list of income based Ja members when there are multiple set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.JSAType', '');
    SetFieldsToValue(caseResponseData, '.Persid', '');

    caseResponseData.fieldData['BU[1].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[1].QBenefit.QWageBen.Adult[1].JSAType'] = '2';
    caseResponseData.fieldData['BU[1].QBenefit.QWageBen.Adult[1].Persid'] = '1';

    caseResponseData.fieldData['BU[4].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[4].QBenefit.QWageBen.Adult[2].JSAType'] = '3';
    caseResponseData.fieldData['BU[4].QBenefit.QWageBen.Adult[2].Persid'] = '8';

    caseResponseData.fieldData['BU[7].QBUId.BUNum'] = '1';
    caseResponseData.fieldData['BU[7].QBenefit.QWageBen.Adult[1].JSAType'] = '2';
    caseResponseData.fieldData['BU[7].QBenefit.QWageBen.Adult[1].Persid'] = '13';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.IncomeBasedJaSupport).toEqual(true);
    expect(result.Household.IncomeBasedJaSupportMembers).toEqual(['1', '8', '13']);
  });

  it('It should return false for IncomeBasedJaSupport with an empty list when there are none set', () => {
    // arrange
    SetFieldsToValue(caseResponseData, '.QBUId.BUNum', '');
    SetFieldsToValue(caseResponseData, '.JSAType', '');

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Household.IncomeBasedJaSupport).toEqual(false);
    expect(result.Household.IncomeBasedJaSupportMembers).toEqual([]);
  });

  it.each(['1',
    '3',
    '6',
    '10'])('It should a respondents array of the the correct size for all Respondents', (numberOfRespondents) => {
      // arrange
      SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
      caseResponseData.fieldData['dmhSize'] = numberOfRespondents;

      // act
      const result = mapCaseSummary(caseResponseData);

      // assert
      expect(result.Respondents.length).toEqual(Number(numberOfRespondents));
    });

  it('It should return the person number when there is only one reposndent', () => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    caseResponseData.fieldData['dmhSize'] = '1';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.PersonNumber).toEqual('1');
  });

  it('It should return the person number for all when there are multiple reposndents', () => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    caseResponseData.fieldData['dmhSize'] = '3';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.PersonNumber).toEqual('1');
    expect(result.Respondents[1]?.PersonNumber).toEqual('2');
    expect(result.Respondents[2]?.PersonNumber).toEqual('3');
  });

  it.each([
    ['1', 'M'],
    ['2', 'F'],
  ])('It should return the expected sex when given valid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].Sex', '');

    caseResponseData.fieldData['dmhSize'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].Sex'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.Sex).toEqual(expectedOutputValue);
  });

  it.each([
    ['0', ''],
    ['3', ''],
    ['', ''],
    ['test', ''],
  ])('It should return the expected sex when given invalid inputs', (inputValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].Sex', '');

    caseResponseData.fieldData['dmhSize'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].Sex'] = inputValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.Sex).toEqual(expectedOutputValue);
  });

  it('It should return the expected sex for all respondents when given valid inputs for multiple responent', () => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].Sex', '');

    caseResponseData.fieldData['dmhSize'] = '4';

    caseResponseData.fieldData['qHousehold.QHHold.Person[1].Sex'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[2].Sex'] = '2';
    caseResponseData.fieldData['qHousehold.QHHold.Person[3].Sex'] = '2';
    caseResponseData.fieldData['qHousehold.QHHold.Person[4].Sex'] = '1';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.Sex).toEqual('M');
    expect(result.Respondents[1]?.Sex).toEqual('F');
    expect(result.Respondents[2]?.Sex).toEqual('F');
    expect(result.Respondents[3]?.Sex).toEqual('M');
  });

  it.each([
    ['1', '', 'COH'],
    ['2', '1', 'S'],
    ['2', '2', 'M'],
    ['2', '3', 'CPL'],
    ['2', '4', 'SEP'],
    ['2', '5', 'DIV'],
    ['2', '6', 'W'],
    ['2', '7', 'CPS'],
    ['2', '8', 'CPD'],
    ['2', '9', 'CPW'],
  ])('It should return the expected marital status when given valid inputs', (inputLivesWithValue: string, inputMaritalStatusValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].livewith', '');
    SetFieldsToValue(caseResponseData, '].ms', '');

    caseResponseData.fieldData['dmhSize'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].livewith'] = inputLivesWithValue;
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].ms'] = inputMaritalStatusValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.MaritalStatus).toEqual(expectedOutputValue);
  });

  it.each([
    ['', '', '-'],
    ['0', '', '-'],
    ['3', '', '-'],
    ['test', '', '-'],
    ['2', '', '-'],
    ['2', '0', '-'],
    ['2', '10', '-'],
    ['2', 'test', '-'],
  ])('It should return the expected marital status when given invalid inputs', (inputLivesWithValue: string, inputMaritalStatusValue: string, expectedOutputValue: string) => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].livewith', '');
    SetFieldsToValue(caseResponseData, '].ms', '');

    caseResponseData.fieldData['dmhSize'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].livewith'] = inputLivesWithValue;
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].ms'] = inputMaritalStatusValue;

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.MaritalStatus).toEqual(expectedOutputValue);
  });

  it('It should return the expected marital status for all respondents when given valid inputs for multiple responent', () => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].livewith', '');
    SetFieldsToValue(caseResponseData, '].ms', '');

    caseResponseData.fieldData['dmhSize'] = '4';

    caseResponseData.fieldData['qHousehold.QHHold.Person[1].livewith'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].ms'] = '';

    caseResponseData.fieldData['qHousehold.QHHold.Person[2].livewith'] = '2';
    caseResponseData.fieldData['qHousehold.QHHold.Person[2].ms'] = '1';

    caseResponseData.fieldData['qHousehold.QHHold.Person[3].livewith'] = '2';
    caseResponseData.fieldData['qHousehold.QHHold.Person[3].ms'] = '3';

    caseResponseData.fieldData['qHousehold.QHHold.Person[4].livewith'] = '2';
    caseResponseData.fieldData['qHousehold.QHHold.Person[4].ms'] = '6';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.MaritalStatus).toEqual('COH');
    expect(result.Respondents[1]?.MaritalStatus).toEqual('S');
    expect(result.Respondents[2]?.MaritalStatus).toEqual('CPL');
    expect(result.Respondents[3]?.MaritalStatus).toEqual('W');
  });

  it('It should return the expected Relationship array when there is only one resident', () => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].R', '');

    caseResponseData.fieldData['dmhSize'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].QRel[1].R'] = '97';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.Relationship).toEqual(['*']);
  });

  it('It should return the expected Relationship array for all residents when there are multiple resident', () => {
    // arrange
    SetFieldsToValue(caseResponseData, 'dmhSize', ''); // 'hhsize' in B4, check with BDSS?
    SetFieldsToValue(caseResponseData, '].R', '');

    caseResponseData.fieldData['dmhSize'] = '4';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].QRel[1].R'] = '97';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].QRel[2].R'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].QRel[3].R'] = '7';
    caseResponseData.fieldData['qHousehold.QHHold.Person[1].QRel[4].R'] = '16';

    caseResponseData.fieldData['qHousehold.QHHold.Person[2].QRel[1].R'] = '1';
    caseResponseData.fieldData['qHousehold.QHHold.Person[2].QRel[2].R'] = '97';
    caseResponseData.fieldData['qHousehold.QHHold.Person[2].QRel[3].R'] = '7';
    caseResponseData.fieldData['qHousehold.QHHold.Person[2].QRel[4].R'] = '16';

    caseResponseData.fieldData['qHousehold.QHHold.Person[3].QRel[1].R'] = '3';
    caseResponseData.fieldData['qHousehold.QHHold.Person[3].QRel[2].R'] = '3';
    caseResponseData.fieldData['qHousehold.QHHold.Person[3].QRel[3].R'] = '97';
    caseResponseData.fieldData['qHousehold.QHHold.Person[3].QRel[4].R'] = '7';

    caseResponseData.fieldData['qHousehold.QHHold.Person[4].QRel[1].R'] = '15';
    caseResponseData.fieldData['qHousehold.QHHold.Person[4].QRel[2].R'] = '15';
    caseResponseData.fieldData['qHousehold.QHHold.Person[4].QRel[3].R'] = '3';
    caseResponseData.fieldData['qHousehold.QHHold.Person[4].QRel[4].R'] = '97';

    // act
    const result = mapCaseSummary(caseResponseData);

    // assert
    expect(result.Respondents[0]?.Relationship).toEqual(['*', '1', '7', '16']);
    expect(result.Respondents[1]?.Relationship).toEqual(['1', '*', '7', '16']);
    expect(result.Respondents[2]?.Relationship).toEqual(['3', '3', '*', '7']);
    expect(result.Respondents[3]?.Relationship).toEqual(['15', '15', '3', '*']);
  });
});
