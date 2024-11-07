import { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import SupervisorHome from '../../Supervisor/Pages/SupervisorHome';

export default function AppContent(): ReactElement {
  return (
    <Route path="/" element={<SupervisorHome />} />
  );
}
