import { AsyncState } from '../hooks/useAsyncRequest';

interface AsyncContentProps<T> {
  content: AsyncState<T>;
  children: (content: T) => React.ReactNode;
}

export default function AsyncContent<T>({ content, children }: AsyncContentProps<T>) {
  if (content.state === 'loading') {
    return <div>Loading...</div>;
  }

  if (content.state === 'errored') {
    return (
      <div>
        Error:
        {content.error}
      </div>
    );
  }

  return <>{children(content.data)}</>;
}
