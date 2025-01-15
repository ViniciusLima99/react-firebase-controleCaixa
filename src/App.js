import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Pages/Navbar';
import Home from './Pages/Home';
import React from 'react';
import Dados from './Pages/Dados'; 
import History from './Pages/History';
import Login from './Pages/Login';
import PrivateRoute from './Pages/PrivateRoute';

function App() {
  return (
    <Router>
          <Navbar/>
          <Routes>
              <Route path="/" element={<Dados/>} />
              <Route path="/transacoes" element={ < Home /> }></Route>
              <Route path="/dados" element={<Dados /> } /> 
              <Route path="/history" element={<History />} /> 
              <Route path="/login" element={<Login />} /> 
          </Routes>
    </Router>
);
}

export default App;
