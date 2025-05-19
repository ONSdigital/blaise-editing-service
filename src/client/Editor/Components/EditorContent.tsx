import { ONSPanel, ONSSelect, ONSTable } from 'blaise-design-system-react-components';
import { ReactElement, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EditorInformation } from '../../Interfaces/editorInterface';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { DownloadCaseSummaryLink } from '../../Common/components/DownloadCaseSummaryLink';

interface EditorContentProps {
  editorInformation: EditorInformation;
  questionnaire: QuestionnaireDetails
}

export default function EditorContent({ editorInformation, questionnaire }: EditorContentProps): ReactElement {
  const [status, setStatus] = useState('');
  const [errorPanelMessage, setErrorPanelMessage] = useState<string | null>(null);

  const handleDownloadError = useCallback((message: string) => {
    setErrorPanelMessage(message);
  }, []);

  const dismissErrorPanel = useCallback(() => {
    setErrorPanelMessage(null);
  }, []);

  return (
    <div className="editorContent" data-testid={`${questionnaire.questionnaireName}-editorContent`}>
      {errorPanelMessage && (
        <ONSPanel status="error">
          <p>{errorPanelMessage}</p>
          <button type="button" className="ons-btn ons-btn--small ons-btn--secondary ons-u-mt-s" onClick={dismissErrorPanel}>Dismiss</button>
        </ONSPanel>
      )}
      <ONSPanel status="info" className="ons-u-mt-m">
        <dl
          className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
          title="editorContent"
          data-testid="editorContent-dl"
        >
          <dt className="ons-description-list__term ons-grid__col ons-col-6@m">Field period</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-6@m"><strong>{questionnaire.fieldPeriod}</strong></dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-6@m">Cases assigned to me</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-6@m"><strong>{editorInformation.numberOfCasesAllocated}</strong></dd>

        </dl>
      </ONSPanel>
      <br />
      <ONSSelect
        defaultValue="in-progress"
        id="filter-cases"
        label="Filter cases"
        onChange={(e) => setStatus(e.target.value)}
        options={[
          {
            label: 'All',
            value: '',
          },
          {
            label: 'In progress',
            value: 'In progress',
          },
          {
            label: 'Queried',
            value: 'Queried',
          },
          {
            label: 'Completed',
            value: 'Completed',
          },
          {
            label: 'Not started',
            value: 'Not started',
          },
        ]}
        value=""
      />
      <br />
      <ONSTable
        columns={[
          'Case ID',
          'Status',
          '',
        ]}
        tableID={`${questionnaire.questionnaireName}-Case-table`}
      >
        <>
          {editorInformation.Cases.filter((c) => (status.length > 0 ? c.EditStatus === status : c)).map((caseDetails) => (
            <tr
              className="ons-table__row"
              key={caseDetails.CaseId}
            >
              <td className="ons-col-2@m ons-table__cell" aria-label={`${questionnaire.questionnaireName}-CaseID`}>
                {caseDetails.CaseId}
              </td>
              <td className="ons-col-2@m ons-table__cell status" aria-label={`${questionnaire.questionnaireName}-EditStatus`}>
                {caseDetails.EditStatus}
              </td>
              <td className="ons-col-8@m ons-table__cell links">
                <DownloadCaseSummaryLink caseId={caseDetails.CaseId} questionnaireName={questionnaire.questionnaireName} onError={handleDownloadError} />
                {' | '}
                <Link to={`/questionnaires/${questionnaire.questionnaireName}/cases/${caseDetails.CaseId}/summary`}>View case summary</Link>
                {' | '}
                <Link to={caseDetails.EditUrl} target="_blank" rel="noopener noreferrer">Edit case</Link>
              </td>
            </tr>
          ))}
        </>
      </ONSTable>
    </div>
  );
}
