import './App.css';
import { ReactElement } from 'react';
import AppRoutes from './Common/components/AppRoutes';
import LayoutTemplate from './Common/components/LayoutTemplate';

function App(): ReactElement {
  return (
    <LayoutTemplate>
      <AppRoutes />
    </LayoutTemplate>

  );
}

export default App;
