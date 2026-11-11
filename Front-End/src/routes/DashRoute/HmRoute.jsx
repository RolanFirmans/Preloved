import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard.jsx'
import DashMnj from '../../pages/PageManajemen/DashMnj.jsx'
import { CartPage, CheckoutPage, OrderCompletePage } from '../../pages/CartCheckout.jsx'

const HmRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<DashMnj/>} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-complete" element={<OrderCompletePage />} />
        </Routes>
    );
}
export default HmRoute;