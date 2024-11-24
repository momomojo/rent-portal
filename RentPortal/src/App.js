import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Payment from './components/Payment';
import Login from './components/Login';
import Register from './components/Register';
import firebase from './firebase';

function App() {
  return (
    <Router>
      <div>
        <h1>RentPortal</h1>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
