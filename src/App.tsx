import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Rounds from './pages/Rounds';
import Round from './pages/Round';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/rounds/:id" element={<Round />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
