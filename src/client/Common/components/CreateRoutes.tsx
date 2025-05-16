import { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';

/**
 * Only allows navigation to a route if a condition is met.
 * Otherwise, it redirects to a different specified route.
 */

function DefaultNotFound(): JSX.Element {
  return (
    <div className="ons-grid">
      <div className="ons-grid__col ons-col-8@m">
        <main id="page-main-content" className="ons-page__main ">
          <h1>404 Not Found</h1>
          <p>
            <a href="/">Back to the homepage</a>
            .
          </p>
        </main>
      </div>
    </div>
  );
}

/* eslint-disable react/jsx-no-useless-fragment */
export default function CreateRoutes({ onConditionThat, children }: CreateRoutesProps): JSX.Element {
  return onConditionThat ? (
    <Routes>
      {children}
      <Route path="*" element={<DefaultNotFound />} />
    </Routes>
  ) : <></>;
}

export type CreateRoutesProps = {
  /**
   * Route is created if its condition is true.
   * For example, `condition={isLoggedIn}` or `condition={isAdmin}`
   */
  onConditionThat: boolean

  children?: ReactNode
};
