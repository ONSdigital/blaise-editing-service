import { Outcome } from 'blaise-api-node-client';
import { ICaseDetails } from '../../server/interfaces/case.details.interface';

const caseDetailsList:ICaseDetails[] = [{
  CaseId: '1',
  CaseStatus: Outcome.Completed,
  CaseLink: 'http://www.cati.com/1',
},
{
  CaseId: '2',
  CaseStatus: Outcome.HQRefusal,
  CaseLink: 'http://www.cati.com/2',
},
{
  CaseId: '3',
  CaseStatus: Outcome.DeleteRequested,
  CaseLink: 'http://www.cati.com/3',
}];

export default caseDetailsList;
