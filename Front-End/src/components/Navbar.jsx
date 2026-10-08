import React, { useState } from 'react';
import { Navbar, Container, Form, InputGroup, Badge, Image } from 'react-bootstrap';
import { BsSearch, BsHeart, BsBag } from 'react-icons/bs';

const Header = () => {
  const [role, setRole] = useState('Customer');

  return (
    <Navbar bg="light" className="py-2 px-3 shadow-sm border-bottom">
      <Container fluid className="d-flex align-items-center justify-content-between">
        
        {/* Logo & Brand Name */}
        <Navbar.Brand href="#home" className="d-flex align-items-center gap-2">
          <div 
            className="d-flex align-items-center justify-content-center bg-success text-white rounded-3" 
            style={{ width: '40px', height: '40px' }}
          >
            {/* Ganti dengan <img src="logo.png" /> jika ada file logo */}
            <span className="fw-bold fs-5">💚</span>
          </div>
          <span className="fw-bold text-dark fs-5">
            PreLoved <span className="text-success">Hub</span>
          </span>
        </Navbar.Brand>

        {/* Search Bar */}
        <div className="grow mx-4" style={{ maxWidth: '500px' }}>
          <InputGroup className="rounded-pill bg-white overflow-hidden shadow-sm border">
            <InputGroup.Text className="bg-white border-0 pe-1 text-muted">
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Cari pakaian preloved, sepatu..."
              className="border-0 shadow-none ps-2"
              aria-label="Search"
            />
          </InputGroup>
        </div>

        {/* Right Section: Role Switcher, Icons & Profile */}
        <div className="d-flex align-items-center gap-4">
          
          {/* Switcher Customer / Admin */}
          <div className="bg-light p-1 rounded-pill border d-flex align-items-center">
            <button
              onClick={() => setRole('Customer')}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                role === 'Customer'
                  ? 'bg-white text-success shadow-sm'
                  : 'text-muted border-0'
              }`}
              style={{ fontSize: '13px' }}
            >
              Customer
            </button>
            <button
              onClick={() => setRole('Admin')}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                role === 'Admin'
                  ? 'bg-white text-success shadow-sm'
                  : 'text-muted border-0'
              }`}
              style={{ fontSize: '13px' }}
            >
              Admin
            </button>
          </div>

          {/* Wishlist Icon */}
          <div className="position-relative cursor-pointer text-dark fs-5">
            <BsHeart />
          </div>

          {/* Cart Icon with Badge */}
          <div className="position-relative cursor-pointer text-dark fs-5">
            <BsBag />
            <Badge 
              bg="success" 
              pill 
              className="position-absolute top-0 start translate-middle"
              style={{ fontSize: '10px' }}
            >
              2
            </Badge>
          </div>

          {/* User Profile Avatar */}
          <div className="position-relative">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              roundedCircle
              width="38"
              height="38"
              className="border-2 border-success object-fit-cover"
              alt="User Profile"
            />
          </div>

        </div>
      </Container>
    </Navbar>
  );
};

export default Header;