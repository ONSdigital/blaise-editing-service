import { ONSPanel, ONSTable } from 'blaise-design-system-react-components';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { EditorInformation } from '../../Interfaces/editorInterface';
import { QuestionnaireDetails } from '../../../common/interfaces/surveyInterface';

interface EditorContentProps {
  editorInformation: EditorInformation;
  questionnaire: QuestionnaireDetails
}

export default function EditorContent({ editorInformation, questionnaire }: EditorContentProps): ReactElement {
  return (
    <div className="editorContent" data-testid={`${questionnaire.questionnaireName}-editorContent`}>
      <ONSPanel status="info">
        <dl
          className="ons-metadata ons-metadata__list ons-grid ons-grid--gutterless ons-u-cf ons-u-mb-no"
          title="editorContent"
          data-testid="editorContent-dl"
          style={{ padding: '0 0 15px 5px' }}
        >
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Field period:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m"><strong>{questionnaire.fieldPeriod}</strong></dd>
          <dt className="ons-description-list__term ons-grid__col ons-col-5@m">Cases assigned to me:</dt>
          <dd className="ons-description-list__value ons-grid__col ons-col-7@m"><strong>{editorInformation.numberOfCasesAllocated}</strong></dd>

        </dl>
      </ONSPanel>
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
          {editorInformation.Cases.map((caseDetails) => (
            <tr
              className="ons-table__row"
              key={caseDetails.CaseId}
            >
              <td className="ons-table__cell" aria-label={`${questionnaire.questionnaireName}-CaseID`}>
                {caseDetails.CaseId}
              </td>
              <td className="ons-table__cell links">
                <Link to={caseDetails.EditUrl} target="_blank" rel="noopener noreferrer">View case</Link>
              </td>
            </tr>
          ))}
        </>
      </ONSTable>
    </div>
  );
}
