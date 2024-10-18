import { EditorInformation } from '../../../client/Interfaces/editorInterface';

export const EditorInformationMockObject1: EditorInformation = {
  numberOfCasesAllocated: 5,
  Cases: [{
    CaseId: '10001011',
    EditStatus: 'Completed',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
  },
  {
    CaseId: '10001012',
    EditStatus: 'In progress',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001012',
  },
  {
    CaseId: '10001013',
    EditStatus: 'Not started',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001013',
  },
  {
    CaseId: '10001014',
    EditStatus: 'Completed',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001014',
  },
  {
    CaseId: '10001015',
    EditStatus: 'Completed',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001015',
  },
  ],
};

export const EditorInformationMockObject2: EditorInformation = {
  numberOfCasesAllocated: 4,
  Cases: [{
    CaseId: '20001011',
    EditStatus: 'Completed',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=10001011',
  },
  {
    CaseId: '20001012',
    EditStatus: 'In progress',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=20001012',
  },
  {
    CaseId: '20001013',
    EditStatus: 'Not started',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=20001013',
  },
  {
    CaseId: '20001014',
    EditStatus: 'Completed',
    EditUrl: 'https://cati.blaise.com/FRS2504A?KeyValue=1000120001014011',
  },
  ],
};
