import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface EditorAllocationProps {
  cases: string [];
  editor: string;
  questionnaireName: string;
}

export default function EditorAllocation({ cases, editor, questionnaireName }:EditorAllocationProps): ReactElement {
  return (
    <>
      <div>
        <span style={{ fontWeight: 'bold' }}>Number Of Cases:</span>
        {' '}
        {cases.length}
      </div>
      <div>
        <span style={{ fontWeight: 'bold' }}>Cases:</span>
        {' '}
        {cases.length === 0 ? 'None' : cases.join(', ')}
      </div>

      <Link to={`/questionnaires/${questionnaireName}/allocation/allocate?userName=${editor}`} style={{ fontWeight: 'normal' }}>
        Allocate
      </Link>
    </>
  );
}
