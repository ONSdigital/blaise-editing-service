import { Link, Route, Routes } from "react-router-dom";

import type { ReactElement, ReactNode } from "react";

function DefaultNotFound(): ReactElement {
  return (
    <main
      id="main-content"
      className="ons-page__main ons-u-mt-l"
    >
      <div className="ons-grid">
        <div className="ons-grid__col ons-col-8@m">
          <h1>Page not found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/">Return home</Link>
        </div>
      </div>
    </main>
  );
}

export default function CreateRoutes({ when, children }: CreateRoutesProps): ReactElement {
  return when ? (
    <Routes>
      {children}
      <Route
        path="*"
        element={<DefaultNotFound />}
      />
    </Routes>
  ) : (
    <></>
  );
}

export type CreateRoutesProps = {
  when: boolean;

  children?: ReactNode;
};
