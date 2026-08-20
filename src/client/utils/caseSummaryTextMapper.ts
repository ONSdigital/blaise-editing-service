import type { CaseSummaryDetails } from "../../common/types/case.types";

function padString(input: string, length: number): string {
  const endSpace = Math.round((length - input.length) / 2);
  const startSpace = length - input.length - endSpace;
  const start = new Array(startSpace).fill(" ").join("");
  const end = new Array(endSpace).fill(" ").join("");

  return `${start}${input}${end}`;
}

function formatDate(date: Date | null | undefined): string {
  if (date == null) {
    return "N/A";
  }

  return new Date(date).toDateString();
}

function formatSummaryLine(label: string, value: string): string {
  return `${label.padEnd(30)}${value}\n`;
}

function formatHouseholdMembersSummary(isEnabled: boolean, members: string[]): string {
  if (!isEnabled) {
    return "No";
  }

  return `Yes - H/H members: ${members.join(", ")}`;
}

export default function toCaseSummaryText(caseSummary: CaseSummaryDetails): string {
  const maxNameLength = caseSummary.Respondents.reduce(
    (max, respondent) => Math.max(max, respondent.RespondentName.length),
    0,
  );
  const nameColumnWidth = Math.max(maxNameLength, 4) + 2;
  const maritalStatusColumnWidth = 16;

  let caseSummaryText = "";

  caseSummaryText += "Interview details\n";
  caseSummaryText += "-----------------\n";
  caseSummaryText += "\n";
  caseSummaryText += formatSummaryLine("Serial number:", caseSummary.CaseId || "");
  caseSummaryText += formatSummaryLine("Outcome code:", caseSummary.OutcomeCode || "");
  caseSummaryText += formatSummaryLine("Interview date:", formatDate(caseSummary.InterviewDate));
  caseSummaryText += formatSummaryLine("District:", caseSummary.District || "");
  caseSummaryText += formatSummaryLine("Interviewer name:", caseSummary.InterviewerName || "");
  caseSummaryText += "\n";
  caseSummaryText += "Household details\n";
  caseSummaryText += "-----------------\n";
  caseSummaryText += "\n";

  caseSummaryText += formatSummaryLine(
    "Accommodation type:",
    `Main: ${caseSummary.Household.Accommodation.Main || ""}, Type: ${caseSummary.Household.Accommodation.Type || ""}`,
  );
  caseSummaryText += formatSummaryLine("Floor number:", caseSummary.Household.FloorNumber || "");
  caseSummaryText += formatSummaryLine("Household status:", caseSummary.Household.Status || "");
  caseSummaryText += formatSummaryLine(
    "Number of bedrooms:",
    caseSummary.Household.NumberOfBedrooms || "",
  );

  caseSummary.Household.ReceiptOfHousingBenefit.forEach((housingBenefit, index) => {
    const label = index === 0 ? "Receipt of housing benefit:" : "";

    caseSummaryText += formatSummaryLine(
      label,
      `Amount: ${housingBenefit.Amount || ""}, Period: ${housingBenefit.PeriodCode || ""}`,
    );
  });

  caseSummaryText += formatSummaryLine("Council tax band:", caseSummary.Household.CouncilTaxBand);
  caseSummaryText += formatSummaryLine(
    "Business room:",
    caseSummary.Household.BusinessRoom ? "Yes" : "No",
  );
  caseSummaryText += formatSummaryLine(
    "Self employed:",
    formatHouseholdMembersSummary(
      caseSummary.Household.SelfEmployed,
      caseSummary.Household.SelfEmployedMembers,
    ),
  );
  caseSummaryText += formatSummaryLine(
    "Income support:",
    formatHouseholdMembersSummary(
      caseSummary.Household.IncomeSupport,
      caseSummary.Household.IncomeSupportMembers,
    ),
  );
  caseSummaryText += formatSummaryLine(
    "Income based JA support:",
    formatHouseholdMembersSummary(
      caseSummary.Household.IncomeBasedJaSupport,
      caseSummary.Household.IncomeBasedJaSupportMembers,
    ),
  );

  caseSummaryText += "\n";
  caseSummaryText += "Relationship grid\n";
  caseSummaryText += "-----------------\n";
  caseSummaryText += "\n";

  caseSummaryText += `${padString("", 4)}|`;
  caseSummaryText += `${padString("Name", nameColumnWidth)}|`;
  caseSummaryText += `${padString("BU", 4)}|`;
  caseSummaryText += `${padString("Sex", 5)}|`;
  caseSummaryText += `${padString("DOB", 17)}|`;
  caseSummaryText += `${padString("Marital status", maritalStatusColumnWidth)}|`;
  for (
    let respondentId = 1;
    respondentId <= Number(caseSummary.NumberOfRespondents);
    respondentId += 1
  ) {
    caseSummaryText += `${padString(`${respondentId}`, 4)}|`;
  }

  caseSummaryText += "\n";

  caseSummary.Respondents.forEach((respondent) => {
    caseSummaryText += `${padString(respondent.PersonNumber || "", 4)}|`;
    caseSummaryText += `${padString(respondent.RespondentName || "", nameColumnWidth)}|`;
    caseSummaryText += `${padString(respondent.BenefitUnit || "", 4)}|`;
    caseSummaryText += `${padString(respondent.Sex || "", 5)}|`;
    caseSummaryText += `${padString(formatDate(respondent.DateOfBirth), 17)}|`;
    caseSummaryText += `${padString(respondent.MaritalStatus || "", maritalStatusColumnWidth)}|`;
    respondent.Relationship.forEach((relationship) => {
      caseSummaryText += `${padString(relationship || "", 4)}|`;
    });
    caseSummaryText += "\n";
  });

  return caseSummaryText;
}
