import { ONSSelect, ONSTable } from 'blaise-design-system-react-components';
import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorInformation } from '../../Interfaces/editorInterface';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';
import { DownloadCaseSummaryLink } from '../../Common/components/DownloadCaseSummaryink';

interface EditorContentProps {
  editorInformation: EditorInformation;
  questionnaire: QuestionnaireDetails
}

export default function EditorContent({ editorInformation, questionnaire }: EditorContentProps): ReactElement {
  const [status, setStatus] = useState('');

  return (
    <div className="editorContent" data-testid={`${questionnaire.questionnaireName}-editorContent`}>
      <div className="ons-summary ons-u-mb-m">
        <div className="ons-summary__group">
          <table className="ons-summary__items" data-testid="editorContent-table">
            <thead className="ons-u-vh">
              <tr>
                <th>Detail</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr className="ons-summary__row ons-summary__row--has-values">
                <td className="ons-summary__item-title">
                  <div className="ons-summary__item--text">
                    Field Period
                  </div>
                </td>
                <td className="ons-summary__values" colSpan={2}>
                  {questionnaire.fieldPeriod}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr className="ons-summary__row ons-summary__row--has-values">
                <td className="ons-summary__item-title">
                  <div className="ons-summary__item--text">
                    Cases assigned to me
                  </div>
                </td>
                <td className="ons-summary__values" colSpan={2}>
                  {editorInformation.numberOfCasesAllocated}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
                <DownloadCaseSummaryLink caseId={caseDetails.CaseId} />
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
