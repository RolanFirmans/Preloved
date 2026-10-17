import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { BsLeaf } from 'react-icons/bs';

const Footer = () => {
  return (
    // Menggunakan overflow-x: hidden dan box-sizing untuk mencegah scroll horizontal
    <footer 
      className="py-5" 
      style={{ 
        backgroundColor: '#f8f9fa', 
        width: '100%', 
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Mengganti Container dengan div yang diberi padding */}
      <div style={{ width: '100%', paddingRight: '1.5rem', paddingLeft: '1.5rem', margin: '0 auto', maxWidth: '1320px' }}>
        <Row className="mb-5 text-start align-items-start g-4">
          
          {/* Kolom 1: Tentang PreLoved Hub */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="fw-bold d-flex align-items-center mb-3 text-dark">
              <img 
                src="pathlogo preloved kecil.png"
                alt="PreLoved Hub Logo" 
                className="me-2"
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              />
              PreLoved Hub
            </h5>
            <p className="text-muted small mb-4">
              Platform kurasi fashion ramah lingkungan. Perpanjang siklus hidup busana berkualitas untuk gaya hidup berkelanjutan.
            </p>
            <Badge pill bg="success-subtle" className="text-success-emphasis border border-success-subtle fw-medium py-2 px-3 d-inline-flex align-items-center">
              <BsLeaf className="me-2" />
              100% Sustainable Curated
            </Badge>
          </Col>

          {/* Kolom 2: Jaminan PreLoved Hub */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h6 className="fw-semibold mb-3 text-dark">Jaminan PreLoved Hub</h6>
            <ul className="list-unstyled text-muted small lh-lg">
              <li>Kurasi Kebersihan & Higienis</li>
              <li>Jaminan Keaslian Brand</li>
              <li>Transparansi Kondisi Detail</li>
              <li>Garansi Retur 48 Jam</li>
            </ul>
          </Col>

          {/* Kolom 3: Bantuan & Informasi */}
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h6 className="fw-semibold mb-3 text-dark">Bantuan & Informasi</h6>
            <ul className="list-unstyled text-muted small lh-lg">
              <li>Panduan Ukuran Pakaian</li>
              <li>Biaya & Opsi Pengiriman</li>
              <li>FAQ Belanja Thrifting</li>
              <li>Syarat & Ketentuan</li>
            </ul>
          </Col>

          {/* Kolom 4: Dampak Lingkungan */}
          <Col lg={3} md={6}>
            <h6 className="fw-semibold mb-3 text-dark">Dampak Lingkungan</h6>
            <p className="text-muted small mb-3">
              Setiap pembelian di PreLoved Hub menghemat rata-rata 2.700 liter air dan mengurangi limbah tekstil nasional.
            </p>
            <div className="bg-light border rounded-3 p-2 text-center">
                <div className="text-muted small mb-1 fw-medium">Total Pakaian Terselamatkan</div>
                <div className="fs-3 fw-bold text-dark">14.280+ Pcs</div>
            </div>
          </Col>
        </Row>

        {/* Pembatas Garis Halus */}
        <hr className="my-4" style={{ borderColor: '#dee2e6' }} />

        {/* Row Bawah: Hak Cipta dan Tautan Kategori */}
        <Row className="text-muted small align-items-center m-0">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0 px-0">
            &copy; {new Date().getFullYear()} PreLoved Hub Indonesia. Seluruh hak cipta dilindungi.
          </Col>
          <Col md={6} className="text-center text-md-end px-0">
            <span className="ms-0 me-3">Moda Sirkular</span>
            <span className="mx-3">Konsumsi Sadar</span>
            <span className="ms-3 me-0">Netral Karbon</span>
          </Col>
        </Row>

      </div>
    </footer>
  );
};

export default Footer;