import { CaseEditInformation } from 'blaise-api-node-client/lib/cjs/interfaces/case';
import CaseOutcome from 'blaise-api-node-client/lib/cjs/enums/caseOutcome';
import EditedStatus from 'blaise-api-node-client/lib/cjs/enums/editedStatus';
import Organisation from 'blaise-api-node-client/lib/cjs/enums/organisation';
import mapEditorInformation from '../../../client/Mappers/editorInformaitionMapper';
import { EditorInformation } from '../../../client/Interfaces/editorInterface';

describe('Map editor informaiton', () => {
  it('It should return a correctly mapped editor information model given all details are present', () => {
    // arrange

    const caseEditInformationList: CaseEditInformation[] = [{
      primaryKey: '10001011',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Rich',
      interviewer: '',
      editedStatus: EditedStatus.NotStarted,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
    },
    {
      primaryKey: '10001013',
      outcome: CaseOutcome.Completed,
      assignedTo: 'Rich',
      interviewer: '',
      editedStatus: EditedStatus.Started,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
    },
    {
      primaryKey: '10001014',
      outcome: CaseOutcome.CompletedProxy,
      assignedTo: 'Jake',
      interviewer: '',
      editedStatus: EditedStatus.Query,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
    },
    {
      primaryKey: '10001015',
      outcome: CaseOutcome.CompletedNudge,
      assignedTo: 'Jake',
      interviewer: '',
      editedStatus: EditedStatus.Finished,
      organisation: Organisation.ONS,
      editUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
    },
    ];

    const expectedEditorInformation: EditorInformation = {
      numberOfCasesAllocated: 4,
      Cases: [{
        CaseId: '10001011',
        EditStatus: 'Not started',
        EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
      },
      {
        CaseId: '10001013',
        EditStatus: 'In progress',
        EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
      },
      {
        CaseId: '10001014',
        EditStatus: 'Queried',
        EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
      },
      {
        CaseId: '10001015',
        EditStatus: 'Completed',
        EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
      }],
    };

    // act
    const result = mapEditorInformation(caseEditInformationList);

    // assert
    expect(result).toEqual(expectedEditorInformation);
  });
});
