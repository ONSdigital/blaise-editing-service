import { type SummaryGroup, SummaryGroupTable, Table } from "blaise-design-system-react-components";

import type { CaseSummaryDetails } from "../../../../common/types/case.types";
import type { ReactElement } from "react";

interface CaseSummaryContentProps {
  caseSummary: CaseSummaryDetails;
}

function getColumnHeadings(numberOfRespondents: number): string[] {
  const columns = ["", "Name", "BU", "Sex", "DOB", "Marital status"];

  for (let respondent = 1; respondent <= numberOfRespondents; respondent += 1) {
    columns.push(`${respondent}`);
  }

  return columns;
}

function formatDate(date: Date | null): string {
  if (date == null) {
    return "N/A";
  }

  return new Date(date).toDateString();
}

function formatHouseholdMembersSummary(isEnabled: boolean, members: string[]): string {
  if (!isEnabled) {
    return "No";
  }

  return `Yes - H/H members: ${members.join(", ")}`;
}

export default function CaseSummaryContent({ caseSummary }: CaseSummaryContentProps): ReactElement {
  const housingBenefitSummary = caseSummary.Household.ReceiptOfHousingBenefit.map(
    (housingBenefit) => `Amount: ${housingBenefit.Amount}, Period: ${housingBenefit.PeriodCode}`,
  );

  const groupedSummary: SummaryGroup[] = [
    {
      title: "Interview details",
      records: {
        "Serial number": caseSummary.CaseId,
        "Outcome code": caseSummary.OutcomeCode,
        "Interview date": formatDate(caseSummary.InterviewDate),
        District: caseSummary.District,
        "Interviewer name": caseSummary.InterviewerName,
      },
    },
    {
      title: "Household details",
      records: {
        "Accommodation type": `Main: ${caseSummary.Household.Accommodation.Main}, Type: ${caseSummary.Household.Accommodation.Type}`,
        "Floor number": caseSummary.Household.FloorNumber,
        "Household status": caseSummary.Household.Status,
        "Number of bedrooms": caseSummary.Household.NumberOfBedrooms,
        "Receipt of housing benefit": {
          display: (
            <>
              {housingBenefitSummary.map((benefitSummary) => (
                <span key={benefitSummary}>
                  {benefitSummary}
                  <br />
                </span>
              ))}
            </>
          ),
          csv: housingBenefitSummary.join(" | "),
        },
        "Council tax band": caseSummary.Household.CouncilTaxBand,
        "Business room": caseSummary.Household.BusinessRoom,
        "Self employed": formatHouseholdMembersSummary(
          caseSummary.Household.SelfEmployed,
          caseSummary.Household.SelfEmployedMembers,
        ),
        "Income support": formatHouseholdMembersSummary(
          caseSummary.Household.IncomeSupport,
          caseSummary.Household.IncomeSupportMembers,
        ),
        "Income based JA support": formatHouseholdMembersSummary(
          caseSummary.Household.IncomeBasedJaSupport,
          caseSummary.Household.IncomeBasedJaSupportMembers,
        ),
      },
    },
  ];

  return (
    <>
      <SummaryGroupTable
        id="case-summary-details"
        groupedSummary={groupedSummary}
        className="ons-u-mt-m ons-u-mb-m"
      />

      <h2 className="ons-summary__group-title">Relationship grid</h2>

      <Table
        columns={getColumnHeadings(Number(caseSummary.NumberOfRespondents))}
        id="Respondents-table"
      >
        <>
          {caseSummary.Respondents.map((respondent) => (
            <tr
              className="ons-table__row"
              key={respondent.PersonNumber}
            >
              <td
                className="ons-table__cell"
                aria-label="RespondentNumber"
                key={`RespondentNumber-${respondent.PersonNumber}`}
              >
                {respondent.PersonNumber}
              </td>
              <td
                className="ons-table__cell status"
                aria-label="RespondentName"
                key={`RespondentName-${respondent.RespondentName}`}
              >
                {respondent.RespondentName}
              </td>
              <td
                className="ons-table__cell"
                aria-label="BenefitUnit"
                key={`BenefitUnit-${respondent.BenefitUnit}`}
              >
                {respondent.BenefitUnit}
              </td>
              <td
                className="ons-table__cell"
                aria-label="Sex"
                key={`Sex-${respondent.Sex}`}
              >
                {respondent.Sex}
              </td>
              <td
                className="ons-table__cell"
                aria-label="DateOfBirth"
                key={`DateOfBirth-${respondent.PersonNumber}`}
              >
                {formatDate(respondent.DateOfBirth)}
              </td>
              <td
                className="ons-table__cell"
                aria-label="MaritalStatus"
                key={`MaritalStatus-${respondent.MaritalStatus}`}
              >
                {respondent.MaritalStatus}
              </td>
              {respondent.Relationship.map((relationship) => (
                <td
                  className="ons-table__cell"
                  aria-label={`Relationship-${respondent.PersonNumber}`}
                  key={`Relationship-${respondent.PersonNumber}-${relationship}`}
                >
                  {relationship}
                </td>
              ))}
            </tr>
          ))}
        </>
      </Table>
    </>
  );
}
