import { ReactElement } from 'react';

interface EditorAllocationProps {
  cases: string [];
}

export default function EditorAllocation({ cases }:EditorAllocationProps): ReactElement {
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
    </>
  );
}
