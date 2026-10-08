import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { 
  BsArrowRightShort, 
  BsHeart, 
  BsStarFill, 
  BsCart2, 
  BsShieldCheck, 
  BsFlower1, 
  BsBoxSeam 
} from 'react-icons/bs';

const Footer = () => {
  return (
    <div className="bg-light py-4">
      {/* ========================================================
          KOTAK CONTAINER 3: FEATURE CARDS / KEUNGGULAN
         ======================================================== */}
      <Container>
        <div className="bg-white rounded-4 p-4 shadow-sm border">
          <Row className="g-3">
            <Col md={4}>
              <div className="p-3 rounded-3 bg-light border d-flex align-items-start gap-3 h-100">
                <div className="p-2 rounded-2 bg-success bg-opacity-10 text-success">
                  <BsShieldCheck size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Kualitas Terjamin</h6>
                  <small className="text-muted d-block" style={{ fontSize: '12px' }}>
                    Pengecekan fisik mendalam pada noda, sobekan, kancing, serta resleting asli.
                  </small>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-3 rounded-3 bg-light border d-flex align-items-start gap-3 h-100">
                <div className="p-2 rounded-2 bg-success bg-opacity-10 text-success">
                  <BsFlower1 size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Pembersihan Ozon & Higienis</h6>
                  <small className="text-muted d-block" style={{ fontSize: '12px' }}>
                    Setiap pakaian melewati cuci ozon dan sterilisasi antibakteri sebelum dikirimkan.
                  </small>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-3 rounded-3 bg-light border d-flex align-items-start gap-3 h-100">
                <div className="p-2 rounded-2 bg-success bg-opacity-10 text-success">
                  <BsBoxSeam size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Kemasan Ramah Lingkungan</h6>
                  <small className="text-muted d-block" style={{ fontSize: '12px' }}>
                    Menggunakan kemasan polybag 100% biodegradable bebas plastik konvensional.
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

    </div>
  );
};

export default Footer;