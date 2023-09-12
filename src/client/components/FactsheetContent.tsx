import { ReactElement } from 'react';
import { ONSPanel } from 'blaise-design-system-react-components';
import { CaseFactsheetDetails } from '../../common/interfaces/caseInterface';

interface FactsheetContentProps {
  factsheet: CaseFactsheetDetails;
}

export default function FactsheetContent({ factsheet }: FactsheetContentProps): ReactElement {
  return (
    <>
      <ONSPanel spacious status="info">
        This factsheer contains information for case
        {' '}
        {factsheet.CaseId}
        {' '}
        completed by
        {' '}
        {factsheet.InterviewerName}
      </ONSPanel>
      <dl
        className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
        style={{ margin: '2rem 0 0 0' }}
        title="Factsheet"
      >
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">CaseId:</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.CaseId}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Address:</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.Address.AddressLine1}</dd>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.Address.AddressLine2}</dd>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.Address.AddressLine3}</dd>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.Address.AddressLine4}</dd>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.Address.Town}</dd>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.Address.County}</dd>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.Address.Postcode}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Interviewer:</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.InterviewerName}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Outcome code:</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.OutcomeCode}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Household size:</dt>
        <dd className="ons-metadata__value ons-grid__col ons-col-9@m">{factsheet.NumberOfRespondents}</dd>
        <dt className="ons-metadata__term ons-grid__col ons-col-3@m">Respondents:</dt>
        {factsheet.Respondents.map((respondent) => (
          <dd className="ons-metadata__value ons-grid__col ons-col-9@m" key={respondent.RespondentName}>
            {respondent.RespondentName}
            {' '}
            {String(respondent.DateOfBirth)}
          </dd>
        ))}
      </dl>
    </>
  );
}
