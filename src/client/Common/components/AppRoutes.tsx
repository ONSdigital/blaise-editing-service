import { Routes, Route } from 'react-router-dom';
import { ReactElement } from 'react';
import SupervisorHome from '../../Supervisor/Pages/SupervisorHome';

export default function AppContent(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<SupervisorHome />} />
    </Routes>
  );
}
