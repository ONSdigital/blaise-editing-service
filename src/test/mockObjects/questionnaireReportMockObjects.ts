import { QuestionnaireReport } from 'blaise-api-node-client';

export const questionnaireReport1MockObject: QuestionnaireReport = {
  questionnaireName: 'LMS2101_AA1',
  questionnaireId: '00000000-0000-0000-0000-000000000000',
  reportingData: [
    {
      'qserial.serial_number': '9001',
      'qhadmin.hout': '110',
      'allocation.toeditor': 'toby',
    },
    {
      'qserial.serial_number': '9002',
      'qhadmin.hout': '310',
      'allocation.toeditor': '',
    },
    {
      'qserial.serial_number': '9003',
      'qhadmin.hout': '0',
      'allocation.toeditor': 'toby',
    },
  ],
};

export const questionnaireReport2MockObject: QuestionnaireReport = {
  questionnaireName: 'LMS2101_AB1',
  questionnaireId: '00000000-0000-0000-0000-000000000000',
  reportingData: [
    {
      'allocation.toeditor': '',
    },
  ],
};

export const questionnaireReport3MockObject: QuestionnaireReport = {
  questionnaireName: 'LMS2101_AC1',
  questionnaireId: '00000000-0000-0000-0000-000000000000',
  reportingData: [],
};

export const questionnaireReport4MockObject: QuestionnaireReport = {
  questionnaireName: 'OPN2201A',
  questionnaireId: '00000000-0000-0000-0000-000000000000',
  reportingData: [
    {
      'allocation.toeditor': 'jake',
    },
    {
      'allocation.toeditor': 'toby',
    },
    {
      'allocation.toeditor': 'jake',
    },
  ],
};

export const questionnaireReportMockObjectList: QuestionnaireReport[] = [
  questionnaireReport1MockObject,
  questionnaireReport2MockObject,
  questionnaireReport3MockObject,
  questionnaireReport4MockObject,
];
