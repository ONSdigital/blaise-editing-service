import { ReactElement } from 'react';
import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { CaseSummaryDetails } from '../../../common/interfaces/caseInterface';

interface CaseSummaryContentProps {
  caseSummary: CaseSummaryDetails;
}

function GetColumnHeadings(numberOfRespondents: number): string[] {
  const columns = [
    '',
    'Name',
    'BU',
    'Sex',
    'DOB',
    'Marital status',
  ];

  for (let respondent = 1; respondent <= numberOfRespondents; respondent += 1) {
    columns.push(`${respondent}`);
  }

  return columns;
}

export default function CaseSummaryContent({ caseSummary }: CaseSummaryContentProps): ReactElement {
  return (
    <>
      <ONSPanel status="info">
        Case summary for
        {' '}
        <strong>{caseSummary.CaseId}</strong>
        {' '}
        completed by
        {' '}
        <strong>{caseSummary.InterviewerName}</strong>
      </ONSPanel>
      <dl
        className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
        style={{ margin: '2% 5% 2% 5%' }}
        title="summary"
      >
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Serial Number</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.CaseId}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Outcome code</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.OutcomeCode}</dd>

        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Interview date</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.InterviewDate == null ? 'N/A' : caseSummary.InterviewDate.toDateString()}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">District</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.District}</dd>

        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Interviewer name</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.InterviewerName}</dd>
      </dl>

      <br />

      <ONSTable
        columns={GetColumnHeadings(Number(caseSummary.NumberOfRespondents))}
        tableCaption="Relationship Grid"
        tableID="Respondents-table"
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
                key={respondent.PersonNumber}
              >
                {respondent.PersonNumber}
              </td>
              <td
                className="ons-table__cell status"
                aria-label="RespondentName"
                key={respondent.RespondentName}
              >
                {respondent.RespondentName}
              </td>
              <td
                className="ons-table__cell"
                aria-label="BenefitUnit"
                key={respondent.BenefitUnit}
              >
                {respondent.BenefitUnit}
              </td>
              <td
                className="ons-table__cell"
                aria-label="Sex"
                key={respondent.Sex}
              >
                {respondent.Sex}
              </td>
              <td
                className="ons-table__cell"
                aria-label="DateOfBirth"
                key={`${respondent.PersonNumber}-DOB`}
              >
                {respondent.DateOfBirth == null ? 'N/A' : respondent.DateOfBirth.toDateString() }
              </td>
              <td
                className="ons-table__cell"
                aria-label="MaritalStatus"
                key={respondent.MaritalStatus}
              >
                {respondent.MaritalStatus}
              </td>
              {respondent.Relationship.map((relationship) => (
                <td
                  className="ons-table__cell"
                  aria-label={`Relationship-${respondent.PersonNumber}`}
                  key={`${relationship}`}
                >
                  {relationship}
                </td>
              ))}
            </tr>
          ))}
        </>
      </ONSTable>

      <br />

      <dl
        className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
        style={{ margin: '2% 5% 2% 5%' }}
      >
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Accommodation type</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">
          {`Main: ${caseSummary.Household.Accommodation.Main} - Type: ${caseSummary.Household.Accommodation.Type}`}
        </dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Floor number</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.Household.FloorNumber}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Household Status</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.Household.Status}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Number of bedrooms</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.Household.NumberOfBedrooms}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Receipt of housing benefit</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">
          {caseSummary.Household.ReceiptOfHousingBenefit.map((housingBenefit) => (
            <span key={housingBenefit.Amount}>
              {`amount: ${housingBenefit.Amount}, period: ${housingBenefit.PeriodCode}`}
              <br />
            </span>
          ))}
        </dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Council tax band</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.Household.CouncilTaxBand}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Business room</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{caseSummary.Household.BusinessRoom ? 'Yes' : 'No'}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Self employed</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">
          {caseSummary.Household.SelfEmployed ? `Yes - H/H members: ${caseSummary.Household.SelfEmployedMembers.join(', ')}` : 'No'}
        </dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Income support</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">
          {caseSummary.Household.IncomeSupport ? `Yes - H/H members: ${caseSummary.Household.IncomeSupportMembers.join(', ')}` : 'No'}
        </dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Income based JA support</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">
          {caseSummary.Household.IncomeBasedJaSupport ? `Yes - H/H members: ${caseSummary.Household.IncomeBasedJaSupportMembers.join(', ')}` : 'No'}
        </dd>
      </dl>

    </>
  );
}
