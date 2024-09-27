import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import Index from './views/Index';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/index" element={<Index />} />
        <Route path="/" element={<Navigate to="/index" />} />
        <Route path="*" element={<Navigate to="/index" replace />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
