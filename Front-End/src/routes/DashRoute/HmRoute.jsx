import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard.jsx'
import DashMnj from '../../pages/PageManajemen/DashMnj.jsx'

const HmRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<DashMnj/>} />
        </Routes>
    );
}
export default HmRoute;