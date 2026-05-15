import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Payment from './pages/Payment';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment/:orderId" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}
