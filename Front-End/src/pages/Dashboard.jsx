import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from '../components/Navbar';
import DashboardContent from '../components/DashboardContent';

const Dashboard = () => {
    return (
        <>
        <div>
            <Header />
        </div>
        <div>
            {/* Konten Halaman */}
            <Container className="py-4">
                <DashboardContent />
            </Container>
        </div>
        </>
    );
}
export default Dashboard;
