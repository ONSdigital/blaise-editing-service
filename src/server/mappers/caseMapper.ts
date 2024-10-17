import { CaseResponse } from 'blaise-api-node-client';
import { CaseSummaryDetails, HousingBenefits } from '../../common/interfaces/caseInterface';

const Accommodation: Record<number, string> = {
  1: 'House/Bungalow',
  2: 'Flat/Maisonette',
  3: 'Room/Rooms',
  4: 'Other',
  5: 'N/A',
};

const AccommodationType: Record<number, string> = {
  1: 'Detached',
  2: 'S-Detached',
  3: 'Terrace',
  4: 'Purp-Built',
  5: 'Converted',
  6: 'Mobile Home',
  7: 'Other Kind',
  8: 'N/A',
};

const HouseStatus: Record<number, string> = {
  1: 'Conventional',
  2: 'Shared',
  3: 'n/a',
};

const BenefitPeriod: Record<number, string> = {
  1: 'One week',
  2: 'Two weeks',
  3: 'Three weeks',
  4: 'Four weeks',
  5: 'calendar month',
  7: 'Two calendar months',
  8: 'Eight times a year',
  9: 'Nine times a year',
  10: 'Ten times a year',
  13: 'Three months/13 weeks',
  24: 'Twice a month',
  26: 'Six months/26 weeks',
  52: 'One year/12 months/52 weeks',
  90: 'Less than one week',
  95: 'One off/lump sum',
  97: 'Unknown',
};

const CouncilTaxBand: Record<number, string> = {
  1: 'Band A',
  2: 'Band B',
  3: 'Band C',
  4: 'Band D',
  5: 'Band E',
  6: 'Band F',
  7: 'Band G',
  8: 'Band H',
  9: 'Band I',
  10: 'Band J',
};

const Sex: Record<number, string> = {
  1: 'M',
  2: 'F',
};

const MartitalStatus: Record<number, string> = {
  1: 'S',
  2: 'M',
  3: 'CPL',
  4: 'SEP',
  5: 'DIV',
  6: 'W',
  7: 'CPS',
  8: 'CPD',
  9: 'CPW',
};

function GetHousingBenefitArray(caseResponse: CaseResponse): HousingBenefits[] {
  const housingBenefit: HousingBenefits[] = [];
  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    for (let person = 1; person <= 2; person += 1) {
      const benefitAmount: string = caseResponse.fieldData[`BU[${benefitUnit}].QBenefit.QBenef2[${person}].HBenAmt`];
      const benefitPeriod: string = BenefitPeriod[Number(caseResponse.fieldData[`BU[${benefitUnit}].QBenefit.QBenef2[${person}].HBenPd`])] ?? '';
      if (Number(benefitAmount) > 0) {
        housingBenefit.push({
          Amount: benefitAmount.substring(0, 6),
          PeriodCode: benefitPeriod,
        });
      }
    }
  }

  return (housingBenefit.length === 0) ? [{ Amount: 'n/a', PeriodCode: 'n/a' }] : housingBenefit;
}

function HasBusinessRoom(caseResponse: CaseResponse): boolean {
  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`BU[${benefitUnit}].QBUId.BUNum`] !== '') {
      for (let person = 1; person <= 2; person += 1) {
        for (let selfJob = 1; selfJob <= 5; selfJob += 1) {
          if (caseResponse.fieldData[`BU[${benefitUnit}].QSelfJob[${selfJob}].Adult[${person}].BusRoom`] === '1') {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function GetSelfEmployedMembers(caseResponse: CaseResponse): string[] {
  const selfEmployedMembers: string[] = [];
  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`BU[${benefitUnit}].QBUId.BUNum`] !== '') {
      for (let person = 1; person <= 2; person += 1) {
        if (caseResponse.fieldData[`BU[${benefitUnit}].QCurst1.Adult[${person}].EmpStat`] === '2') {
          selfEmployedMembers.push(caseResponse.fieldData[`BU[${benefitUnit}].QCurst1.Adult[${person}].Persid`]);
        }
      }
    }
  }

  return selfEmployedMembers;
}

function GetIncomeSupportPeople(caseResponse: CaseResponse): string[] {
  const incomeSupportPeople: string[] = [];
  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`BU[${benefitUnit}].QBUId.BUNum`] !== '') {
      for (let person = 1; person <= 2; person += 1) {
        for (let wageBenefit = 1; wageBenefit <= 10; wageBenefit += 1) {
          if (caseResponse.fieldData[`BU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].WageBen[${wageBenefit}]`] === '5') {
            incomeSupportPeople.push(caseResponse.fieldData[`BU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].Persid`]);
          }
        }
      }
    }
  }

  return incomeSupportPeople;
}

function GetJsaPeople(caseResponse: CaseResponse): string[] {
  const jsaPeople: string[] = [];
  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`BU[${benefitUnit}].QBUId.BUNum`] !== '') {
      for (let person = 1; person <= 2; person += 1) {
        if (caseResponse.fieldData[`BU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].JSAType`] === '2'
          || caseResponse.fieldData[`BU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].JSAType`] === '3') {
          jsaPeople.push(caseResponse.fieldData[`BU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].Persid`]);
        }
      }
    }
  }

  return jsaPeople;
}

function GetMaritalStatus(caseResponse: CaseResponse, respondentNumber: number): string {
  if (caseResponse.fieldData[`hhg.p[${respondentNumber}].livewith`] === '1') {
    return 'COH';
  }
  return MartitalStatus[Number(caseResponse.fieldData[`hhg.p[${respondentNumber}].ms`])] ?? '-';
}

function GetRelationshipMatrix(caseResponse: CaseResponse, respondentNumber: number, numberOfRespondents: number): string[] {
  const relationshipMatrix: string[] = [];
  for (let person = 1; person <= numberOfRespondents; person += 1) {
    let relationship: string = caseResponse.fieldData[`hhg.P[${respondentNumber}].QRel[${person}].R`];
    if (relationship === '97') {
      relationship = '*';
    }
    relationshipMatrix.push(relationship);
  }

  return relationshipMatrix;
}

export default function mapCaseSummary(caseResponse: CaseResponse): CaseSummaryDetails {
  const housingBenefitArray = GetHousingBenefitArray(caseResponse);
  const businessRoom = HasBusinessRoom(caseResponse);
  const selfEmployedMembers = GetSelfEmployedMembers(caseResponse);
  const jsaPeople = GetJsaPeople(caseResponse);
  const incomeSupportPeople = GetIncomeSupportPeople(caseResponse);
  const caseSummary: CaseSummaryDetails = {
    CaseId: caseResponse.caseId,
    OutcomeCode: caseResponse.fieldData['qhAdmin.HOut'],
    InterviewDate: new Date(caseResponse.fieldData['QSignIn.StartDat']),
    District: caseResponse.fieldData['qDataBag.District'],
    InterviewerName: caseResponse.fieldData['qhAdmin.Interviewer[1]'],
    NumberOfRespondents: caseResponse.fieldData['dmhSize'], // 'hhsize' in B4, check with BDSS?
    Household: {
      Accommodation: {
        Main: Accommodation[Number(caseResponse.fieldData['qhAdmin.QObsSheet.MainAcD'])] ?? '',
        Type: AccommodationType[Number(caseResponse.fieldData['qhAdmin.QObsSheet.TypAcDV'])] ?? '',
      },
      FloorNumber: caseResponse.fieldData['qhAdmin.QObsSheet.FloorN'],
      Status: HouseStatus[Number(caseResponse.fieldData['QAccomdat.HHStat'])] ?? '',
      NumberOfBedrooms: caseResponse.fieldData['QAccomdat.Bedroom'],
      ReceiptOfHousingBenefit: housingBenefitArray,
      CouncilTaxBand: CouncilTaxBand[Number(caseResponse.fieldData['QCounTax.CTBand'])] ?? 'Blank',
      BusinessRoom: businessRoom,
      SelfEmployed: selfEmployedMembers.length > 0,
      SelfEmployedMembers: selfEmployedMembers,
      IncomeSupport: incomeSupportPeople.length > 0,
      IncomeSupportMembers: incomeSupportPeople,
      IncomeBasedJaSupport: jsaPeople.length > 0,
      IncomeBasedJaSupportMembers: jsaPeople,
    },
    Respondents: [],
  };

  const numberOfRespondents = +caseSummary.NumberOfRespondents;

  if (Number.isNaN(numberOfRespondents) || numberOfRespondents === 0) {
    throw new Error('Number of responents not specified');
  }

  for (let respondentNumber = 1; respondentNumber <= numberOfRespondents; respondentNumber += 1) {
    caseSummary.Respondents.push({
      PersonNumber: `${respondentNumber}`,
      RespondentName: caseResponse.fieldData[`dmName[${respondentNumber}]`], // `QNames.M[${respondentNumber}].Name` in B4, check with BDSS?
      BenefitUnit: caseResponse.fieldData[`hhg.P[${respondentNumber}].BenUnit`],
      Sex: Sex[Number(caseResponse.fieldData[`hhg.P[${respondentNumber}].Sex`])] ?? '',
      DateOfBirth: new Date(caseResponse.fieldData[`dmDteOfBth[${respondentNumber}]`]), // `hhg.P[${respondentNumber}].DoB` in B4, check with BDSS?
      MaritalStatus: GetMaritalStatus(caseResponse, respondentNumber),
      Relationship: GetRelationshipMatrix(caseResponse, respondentNumber, numberOfRespondents),
    });
  }

  return caseSummary;
}
