import { CaseSummaryDetails } from '../../common/interfaces/caseInterface';

function PadString(input: string, length: number): string {
  const endSpace = Math.round((length - input.length) / 2);
  const startSpace = length - input.length - endSpace;
  const start = new Array(startSpace).fill(' ').join('');
  const end = new Array(endSpace).fill(' ').join('');

  return `${start}${input}${end}`;
}

export default function mapCaseSummaryText(caseSummary: CaseSummaryDetails): string {
  const maxNameLength = caseSummary.Respondents.reduce((max, respondent) => Math.max(max, respondent.RespondentName.length), 0);
  const nameColumnWidth = Math.max(maxNameLength, 4) + 2;

  let caseSummaryText = '';
  caseSummaryText += '\n';
  caseSummaryText += 'Fact Sheet\n';
  caseSummaryText += '\n';
  caseSummaryText += '\n';
  caseSummaryText += `Case ID:            ${caseSummary.CaseId || ''}\n`;
  caseSummaryText += `Outcome:            ${caseSummary.OutcomeCode || ''}\n`;
  caseSummaryText += `Interview date:     ${caseSummary.InterviewDate == null ? 'N/A' : (new Date(caseSummary.InterviewDate)).toDateString()}\n`;
  caseSummaryText += `District:           ${caseSummary.District || ''}\n`;
  caseSummaryText += `Interviewer:        ${caseSummary.InterviewerName || ''}\n`;
  caseSummaryText += '\n';

  caseSummaryText += `${PadString('', 4)}|`;
  caseSummaryText += `${PadString('Name', nameColumnWidth)}|`;
  caseSummaryText += `${PadString('BU', 4)}|`;
  caseSummaryText += `${PadString('Sex', 5)}|`;
  caseSummaryText += `${PadString('DOB', 17)}|`;
  caseSummaryText += `${PadString('Mar Stat', 10)}|`;
  for (let respondentId = 1; respondentId <= Number(caseSummary.NumberOfRespondents); respondentId += 1) {
    caseSummaryText += `${PadString(`${respondentId}`, 4)}|`;
  }
  caseSummaryText += '\n';

  caseSummary.Respondents.forEach((respondent) => {
    caseSummaryText += `${PadString(respondent.PersonNumber || '', 4)}|`;
    caseSummaryText += `${PadString(respondent.RespondentName || '', nameColumnWidth)}|`;
    caseSummaryText += `${PadString(respondent.BenefitUnit || '', 4)}|`;
    caseSummaryText += `${PadString(respondent.Sex || '', 5)}|`;
    caseSummaryText += `${PadString((new Date(respondent.DateOfBirth))?.toDateString() || '', 17)}|`;
    caseSummaryText += `${PadString(respondent.MaritalStatus || '', 10)}|`;
    respondent.Relationship.forEach((relationship) => {
      caseSummaryText += `${PadString(relationship || '', 4)}|`;
    });
    caseSummaryText += '\n';
  });

  caseSummaryText += '\n';

  caseSummaryText += `Accommodation type:               Main: ${caseSummary.Household.Accommodation.Main || ''}  Type: ${caseSummary.Household.Accommodation.Type || ''}\n`;
  caseSummaryText += `Floor number:                     ${caseSummary.Household.FloorNumber || ''}\n`;
  caseSummaryText += `Household status:                 ${caseSummary.Household.Status || ''}\n`;
  caseSummaryText += `Number of bedrooms:               ${caseSummary.Household.NumberOfBedrooms || ''}\n`;

  caseSummary.Household.ReceiptOfHousingBenefit.forEach((housingBenefit, index) => {
    if (index === 0) {
      caseSummaryText += `Receipt of housing benefit:       Amount: ${housingBenefit.Amount || ''}, Period: ${housingBenefit.PeriodCode || ''}\n`;
    }
    if (index > 0) {
      caseSummaryText += `                                  Amount: ${housingBenefit.Amount || ''}, Period: ${housingBenefit.PeriodCode || ''}\n`;
    }
  });

  caseSummaryText += `Council tax band:                 ${caseSummary.Household.CouncilTaxBand}\n`;
  caseSummaryText += `Business room:                    ${(caseSummary.Household.BusinessRoom) ? 'Yes' : 'No'}\n`;
  caseSummaryText += `Self employed:                    ${(caseSummary.Household.SelfEmployed) ? `Yes  -  H/H members: ${caseSummary.Household.SelfEmployedMembers.join(', ')}` : 'No'}\n`;
  caseSummaryText += `Income support:                   ${(caseSummary.Household.IncomeSupport) ? `Yes  -  H/H members: ${caseSummary.Household.IncomeSupportMembers.join(', ')}` : 'No'}\n`;
  caseSummaryText += `Income based JA support:          ${(caseSummary.Household.IncomeBasedJaSupport) ? `Yes  -  H/H members: ${caseSummary.Household.IncomeBasedJaSupportMembers.join(', ')}` : 'No'}`;

  return caseSummaryText;
}
