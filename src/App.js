import Getstart from './home/index';
import Login from './account/login';
import Register from './account/register';
import Dashboard  from './pages/dashbord';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 Add Getstart route here */}
        <Route path="/" element={<Getstart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
