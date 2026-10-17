
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  Spinner,
  Alert
} from 'react-bootstrap';

import { BsHeart, BsStarFill, BsCart2, BsShieldCheck, BsFlower1, BsBoxSeam } from 'react-icons/bs';

import Header from '../components/Navbar';
import Footer from '../components/Footer';

const detailProduk = () => {


  return (
    <>
      <div>
        <Header />
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default detailProduk;