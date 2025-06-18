import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Rounds from './pages/Rounds';
import Round from './pages/Round';
import './App.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rounds" element={<Rounds />} />
          <Route path="/rounds/:roundId" element={<Round />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
