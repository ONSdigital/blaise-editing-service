import { AsyncState, hasErrored, isLoading } from '../hooks/useAsyncRequest';

interface AsyncContentProps<T> {
  content: AsyncState<T>;
  children: (content: T) => React.ReactNode;
}

export default function AsyncContent<T>({ content, children }: AsyncContentProps<T>) {
  if (isLoading(content)) {
    return <div>Loading...</div>;
  }

  if (hasErrored(content)) {
    return (
      <div>
        Error:
        {content.error}
      </div>
    );
  }

  return <>{children(content.data)}</>;
}
