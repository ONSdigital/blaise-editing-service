import type { CaseSummaryDetails, HousingBenefits } from "../../common/types/case.types.js";
import type { CaseResponse } from "blaise-api-node-client";

const ACCOMMODATION: Record<number, string> = {
  1: "House/Bungalow",
  2: "Flat/Maisonette",
  3: "Room/Rooms",
  4: "Other",
  5: "N/A",
};

const ACCOMMODATION_TYPE: Record<number, string> = {
  1: "Detached",
  2: "S-Detached",
  3: "Terrace",
  4: "Purp-Built",
  5: "Converted",
  6: "Mobile Home",
  7: "Other Kind",
  8: "N/A",
};

const HOUSE_STATUS: Record<number, string> = {
  1: "Conventional",
  2: "Shared",
  3: "N/A",
};

const BENEFIT_PERIOD: Record<number, string> = {
  1: "One week",
  2: "Two weeks",
  3: "Three weeks",
  4: "Four weeks",
  5: "calendar month",
  7: "Two calendar months",
  8: "Eight times a year",
  9: "Nine times a year",
  10: "Ten times a year",
  13: "Three months/13 weeks",
  24: "Twice a month",
  26: "Six months/26 weeks",
  52: "One year/12 months/52 weeks",
  90: "Less than one week",
  95: "One off/lump sum",
  97: "Unknown",
};

const COUNCIL_TAX_BAND: Record<number, string> = {
  1: "Band A",
  2: "Band B",
  3: "Band C",
  4: "Band D",
  5: "Band E",
  6: "Band F",
  7: "Band G",
  8: "Band H",
  9: "Band I",
  10: "Band J",
};

const SEX: Record<number, string> = {
  1: "M",
  2: "F",
};

const MARITAL_STATUS: Record<number, string> = {
  1: "S",
  2: "M",
  3: "CPL",
  4: "SEP",
  5: "DIV",
  6: "W",
  7: "CPS",
  8: "CPD",
  9: "CPW",
};

function getHousingBenefitArray(caseResponse: CaseResponse): HousingBenefits[] {
  const housingBenefit: HousingBenefits[] = [];

  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    for (let person = 1; person <= 2; person += 1) {
      const benefitAmount: string =
        (caseResponse.fieldData[
          `bU[${benefitUnit}].QBenefit.QBenef2[${person}].HBenAmt`
        ] as string) ?? "";
      const benefitPeriod: string =
        BENEFIT_PERIOD[
          Number(caseResponse.fieldData[`bU[${benefitUnit}].QBenefit.QBenef2[${person}].HBenPd`])
        ] ?? "";

      if (Number(benefitAmount) > 0) {
        housingBenefit.push({
          Amount: benefitAmount.substring(0, 6),
          PeriodCode: benefitPeriod,
        });
      }
    }
  }

  return housingBenefit.length === 0 ? [{ Amount: "N/A", PeriodCode: "N/A" }] : housingBenefit;
}

function hasBusinessRoom(caseResponse: CaseResponse): boolean {
  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`bU[${benefitUnit}].QBUId.BUNum`] !== "") {
      for (let person = 1; person <= 2; person += 1) {
        for (let selfJob = 1; selfJob <= 5; selfJob += 1) {
          if (
            caseResponse.fieldData[
              `bU[${benefitUnit}].QSelfJob[${selfJob}].Adult[${person}].BusRoom`
            ] === "1"
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function getSelfEmployedMembers(caseResponse: CaseResponse): string[] {
  const selfEmployedMembers: string[] = [];

  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`bU[${benefitUnit}].QBUId.BUNum`] !== "") {
      for (let person = 1; person <= 2; person += 1) {
        if (caseResponse.fieldData[`bU[${benefitUnit}].QCurSt1.Adult[${person}].EmpStat`] === "2") {
          selfEmployedMembers.push(
            (caseResponse.fieldData[
              `bU[${benefitUnit}].QCurSt1.Adult[${person}].PersId`
            ] as string) ?? "",
          );
        }
      }
    }
  }

  return selfEmployedMembers;
}

function getIncomeSupportPeople(caseResponse: CaseResponse): string[] {
  const incomeSupportPeople: string[] = [];

  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`bU[${benefitUnit}].QBUId.BUNum`] !== "") {
      for (let person = 1; person <= 2; person += 1) {
        const wageBen = caseResponse.fieldData[
          `bU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].WageBen`
        ] as string;

        if (wageBen && wageBen.includes("5")) {
          incomeSupportPeople.push(
            (caseResponse.fieldData[
              `bU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].PersId`
            ] as string) ?? "",
          );
        }
      }
    }
  }

  return incomeSupportPeople;
}

function getJsaPeople(caseResponse: CaseResponse): string[] {
  const jsaPeople: string[] = [];

  for (let benefitUnit = 1; benefitUnit <= 7; benefitUnit += 1) {
    if (caseResponse.fieldData[`bU[${benefitUnit}].QBUId.BUNum`] !== "") {
      for (let person = 1; person <= 2; person += 1) {
        const jsaType = caseResponse.fieldData[
          `bU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].JSAType`
        ] as string;

        if (jsaType === "2" || jsaType === "3") {
          jsaPeople.push(
            (caseResponse.fieldData[
              `bU[${benefitUnit}].QBenefit.QWageBen.Adult[${person}].PersId`
            ] as string) ?? "",
          );
        }
      }
    }
  }

  return jsaPeople;
}

function getMaritalStatus(caseResponse: CaseResponse, respondentNumber: number): string {
  if (caseResponse.fieldData[`qHousehold.QHHold.Person[${respondentNumber}].livewith`] === "1") {
    return "COH";
  }

  return (
    MARITAL_STATUS[
      Number(caseResponse.fieldData[`qHousehold.QHHold.Person[${respondentNumber}].ms`])
    ] ?? "-"
  );
}

function getRelationshipMatrix(
  caseResponse: CaseResponse,
  respondentNumber: number,
  numberOfRespondents: number,
): string[] {
  const relationshipMatrix: string[] = [];

  for (let person = 1; person <= numberOfRespondents; person += 1) {
    let relationship: string =
      (caseResponse.fieldData[
        `qHousehold.QHHold.Person[${respondentNumber}].QRel[${person}].R`
      ] as string) ?? "";

    if (relationship === "97") {
      relationship = "*";
    }

    relationshipMatrix.push(relationship);
  }

  return relationshipMatrix;
}

export default function toCaseSummary(caseResponse: CaseResponse): CaseSummaryDetails {
  const housingBenefitArray = getHousingBenefitArray(caseResponse);
  const businessRoom = hasBusinessRoom(caseResponse);
  const selfEmployedMembers = getSelfEmployedMembers(caseResponse);
  const jsaPeople = getJsaPeople(caseResponse);
  const incomeSupportPeople = getIncomeSupportPeople(caseResponse);

  const interviewStartDate = caseResponse.fieldData["qSignIn.StartDat"];
  let interviewDate = new Date(NaN);

  if (typeof interviewStartDate === "string" && interviewStartDate) {
    const [day, month, year] = interviewStartDate.split("-");

    interviewDate = new Date(`${year}-${month}-${day}`);
  }

  const caseSummary: CaseSummaryDetails = {
    CaseId: caseResponse.caseId,
    OutcomeCode: (caseResponse.fieldData["qhAdmin.HOut"] as string) ?? "",
    InterviewDate: interviewDate,
    District: (caseResponse.fieldData["qDataBag.District"] as string) ?? "",
    InterviewerName: (caseResponse.fieldData["qhAdmin.Interviewer[1]"] as string) ?? "",
    NumberOfRespondents: (caseResponse.fieldData["dmhSize"] as string) ?? "",
    Household: {
      Accommodation: {
        Main: ACCOMMODATION[Number(caseResponse.fieldData["qhAdmin.QObsSheet.MainAcD"])] ?? "N/A",
        Type:
          ACCOMMODATION_TYPE[Number(caseResponse.fieldData["qhAdmin.QObsSheet.TypAcDV"])] ?? "N/A",
      },
      FloorNumber: (caseResponse.fieldData["qhAdmin.QObsSheet.FloorN"] as string) ?? "",
      Status: HOUSE_STATUS[Number(caseResponse.fieldData["qAccomdat.HHStat"])] ?? "",
      NumberOfBedrooms: (caseResponse.fieldData["qAccomdat.Bedroom"] as string) ?? "",
      ReceiptOfHousingBenefit: housingBenefitArray,
      CouncilTaxBand:
        COUNCIL_TAX_BAND[Number(caseResponse.fieldData["qCounTax.CTBand"])] ?? "Blank",
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

  const numberOfRespondents = Number.parseInt(caseSummary.NumberOfRespondents, 10);

  if (Number.isNaN(numberOfRespondents) || numberOfRespondents <= 0) {
    return caseSummary;
  }

  for (let respondentNumber = 1; respondentNumber <= numberOfRespondents; respondentNumber += 1) {
    const dateOfBirth = caseResponse.fieldData[`qHousehold.QHHold.Person[${respondentNumber}].DoB`];
    let dob = "";

    if (typeof dateOfBirth === "string" && dateOfBirth) {
      const [dayOfBirth, monthOfBirth, yearOfBirth] = dateOfBirth.split("-");

      dob = `${yearOfBirth}-${monthOfBirth}-${dayOfBirth}`;
    }

    caseSummary.Respondents.push({
      PersonNumber: `${respondentNumber}`,
      RespondentName: (caseResponse.fieldData[`dmName[${respondentNumber}]`] as string) ?? "",
      BenefitUnit:
        (caseResponse.fieldData[
          `qHousehold.QHHold.Person[${respondentNumber}].BenUnit`
        ] as string) ?? "",
      Sex:
        SEX[Number(caseResponse.fieldData[`qHousehold.QHHold.Person[${respondentNumber}].Sex`])] ??
        "",
      DateOfBirth: new Date(dob),
      MaritalStatus: getMaritalStatus(caseResponse, respondentNumber),
      Relationship: getRelationshipMatrix(caseResponse, respondentNumber, numberOfRespondents),
    });
  }

  return caseSummary;
}
