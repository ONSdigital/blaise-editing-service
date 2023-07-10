import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer, Header } from 'blaise-design-system-react-components';
import Home from './pages/Home';
import Questionnaires from './pages/Questionnaires';
import Cases from './pages/Cases';

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
          {
            endpoint: '/questionnaires',
            id: 'questionnaires',
            label: 'List of questionnaires',
          },
        ]}
      />
      <div style={divStyle} className="ons-page__container ons-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="questionnaires" element={<Questionnaires />} />
          <Route path="questionnaires/:questionnaireName/cases/" element={<Cases />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
