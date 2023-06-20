import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header } from 'blaise-design-system-react-components';
import Home from './pages/Home';
import Questionnaires from './pages/Questionnaires';

const divStyle = {
  minHeight: 'calc(67vh)',
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="questionnaires" element={<Questionnaires />} />
      </Routes>

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
      <div style={divStyle} className="ons-page__container ons-container" />
      <Footer />
    </>
  );
}

export default App;
