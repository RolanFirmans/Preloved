import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import HmRoute from './routes/DashRoute/HmRoute.jsx'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <HmRoute />
        </BrowserRouter>
    </React.StrictMode>
)
