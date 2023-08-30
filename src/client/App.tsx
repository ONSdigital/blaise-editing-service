import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header } from 'blaise-design-system-react-components';
import Cases from './pages/Cases';
import CaseFactsheet from './pages/CaseFactsheet';
import Surveys from './pages/Surveys';

const divStyle = {
  minHeight: 'calc(67vh)',
};

function App() {
  return (
    <>
      <Header
        title="Blaise Editing Service"
        navigationLinks={[
          {
            endpoint: '/',
            id: 'home',
            label: 'Home',
          },
        ]}
      />
      <div style={divStyle} className="ons-page__container ons-container">
        <Routes>
          <Route path="/" element={<Surveys />} />
          <Route path="questionnaires/:questionnaireName/cases/" element={<Cases />} />
          <Route path="questionnaires/:questionnaireName/cases/:caseId/factsheet" element={<CaseFactsheet />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
