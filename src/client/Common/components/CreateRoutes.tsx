import { ReactNode } from 'react';
import { Routes } from 'react-router-dom';

/**
 * Only allows navigation to a route if a condition is met.
 * Otherwise, it redirects to a different specified route.
 */

/* eslint-disable react/jsx-no-useless-fragment */
export default function CreateRoutes({ onConditionThat, children }: CreateRoutesProps): JSX.Element {
  return onConditionThat ? <Routes>{children}</Routes> : <></>;
}

export type CreateRoutesProps = {
  /**
   * Route is created if its condition is true.
   * For example, `condition={isLoggedIn}` or `condition={isAdmin}`
   */
  onConditionThat: boolean

  children?: ReactNode
};
