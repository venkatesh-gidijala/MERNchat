import './App.css';
import Registration from './Components/Registration';
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import { Routes, Route } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path='/' element={<Registration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/HomePage' element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
