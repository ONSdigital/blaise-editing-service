import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from 'blaise-design-system-react-components';
import Home from './pages/Home';
import Questionnaires from './pages/Questionnaires';

function App() {
  return (
    <div className="App">
      <Header
        title="Blaise Editing Service"
        navigationLinks={[
          {
            endpoint: '/',
            id: 'home',
            label: 'Home',
          },
          {
            endpoint: '/questionnaires',
            id: 'questionnaires',
            label: 'List of questionnaires',
          },
        ]}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="questionnaires" element={<Questionnaires />} />
      </Routes>
    </div>
  );
}

export default App;
