import { ONSLoadingPanel } from 'blaise-design-system-react-components';
import { AsyncState, hasErrored, isLoading } from '../hooks/useAsyncRequest';
import ErrorPanel from './ErrorPanel';

interface AsyncContentProps<T> {
  content: AsyncState<T>;
  children: (content: T) => React.ReactNode;
}

export default function AsyncContent<T>({ content, children }: AsyncContentProps<T>) {
  if (isLoading(content)) {
    return <ONSLoadingPanel />;
  }

  if (hasErrored(content)) {
    return <ErrorPanel message={content.error} />;
  }

  return <>{children(content.data)}</>;
}
