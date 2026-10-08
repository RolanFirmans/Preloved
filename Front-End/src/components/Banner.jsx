import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { BsArrowRightShort } from 'react-icons/bs';

const Banner = () => {
  return (
    <div className="bg-light py-4">
      <Container className="mb-4">
        <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border">
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill fw-normal mb-3">
                🍃 CIRCULAR FASHION MOVEMENT
              </Badge>
              <h1 className="fw-bold display-5 text-dark mb-3">
                Gaya Keren Tanpa <br />
                <span className="text-dark">Bebani Bumi.</span>
              </h1>
              <p className="text-muted mb-4 pe-lg-5">
                Kurasi busana preloved premium yang telah melewati proses verifikasi higienis, seleksi ketat, dan siap menghidupkan pesona vintage terbaikmu hari ini.
              </p>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                <Button style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }} className="rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                  Jelajahi Sekarang <BsArrowRightShort size={20} />
                </Button>
                <span className="text-muted small">🛡️ Garansi Retur 48 Jam</span>
              </div>

              {/* Stats Sub-Cards */}
              <Row className="g-3">
                <Col xs={4}>
                  <div className="bg-light p-3 rounded-3 border">
                    <h4 className="fw-bold mb-0 text-dark">3,400+</h4>
                    <small className="text-muted" style={{ fontSize: '11px' }}>Kg Tekstil Diselamatkan</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="bg-light p-3 rounded-3 border">
                    <h4 className="fw-bold mb-0 text-dark">9.1M L</h4>
                    <small className="text-muted" style={{ fontSize: '11px' }}>Air Bersih Terhemat</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="bg-light p-3 rounded-3 border">
                    <h4 className="fw-bold mb-0 text-dark">100%</h4>
                    <small className="text-muted" style={{ fontSize: '11px' }}>Hygienic & Sanitized</small>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col lg={5}>
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
                alt="Hero Fashion"
                className="img-fluid rounded-4 shadow-sm w-100 object-fit-cover"
                style={{ maxHeight: '420px' }}
              />
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Banner;