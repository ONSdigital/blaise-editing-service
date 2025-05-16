import { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

/**
 * Only allows navigation to a route if a condition is met.
 * Otherwise, it redirects to a different specified route.
 */

// Simple default 404 component
function DefaultNotFound(): JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;

  return <Navigate to={`/?error=Page not found: ${currentPath}`} replace />;
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
