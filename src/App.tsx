import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';

// Component to handle tracking page views on every client-side route change
function PixelPageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'PageView');
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <PixelPageViewTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </BrowserRouter>
  );
}


