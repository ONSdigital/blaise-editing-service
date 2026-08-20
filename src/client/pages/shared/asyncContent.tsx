import { LoadingPanel } from "blaise-design-system-react-components";

import { type AsyncState, hasErrored, isLoading } from "../../utils/useAsyncRequest";

import ErrorPanel from "./errorPanel";

interface AsyncContentProps<T> {
  content: AsyncState<T>;
  children: (content: T) => React.ReactNode;
}

export default function AsyncContent<T>({ content, children }: AsyncContentProps<T>) {
  if (isLoading(content)) {
    return <LoadingPanel />;
  }

  if (hasErrored(content)) {
    return <ErrorPanel message={content.error} />;
  }

  return <>{children(content.data)}</>;
}
