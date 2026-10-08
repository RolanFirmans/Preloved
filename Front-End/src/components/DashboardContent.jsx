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

const DashboardContent = () => {
  const [activeCategory, setActiveCategory] = useState('Semua Pakaian');

  const categories = [
    'Semua Pakaian', 'Atasan Pria', 'Atasan Wanita', 
    'Bawahan Pria', 'Bawahan Wanita', 'Sepatu'
  ];

  const products = [
    {
      id: 1,
      tag: 'Like New',
      category: 'Sepatu',
      title: 'Nike Air Jordan 1 Low Retro',
      desc: 'Materi kulit asli sangat mulus, sol bawah 85% tebal, insole original & bersih.',
      rating: '4.9',
      price: '450.000',
      stock: 'Sisa 1 pcs',
      img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500'
    },
    {
      id: 2,
      tag: 'Very Good',
      category: 'Atasan Pria',
      title: 'Kemeja Flanel Vintage Uniqlo Plaid',
      desc: 'Bahan katun hangat, kancing lengkap original, motif flanel kotak warna segar.',
      rating: '4.8',
      price: '125.000',
      stock: 'Sisa 3 pcs',
      img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'
    },
    {
      id: 3,
      tag: 'Pilihan',
      category: 'Bawahan Pria',
      title: 'Celana Chino Slim Fit Dickies 874',
      desc: 'Serat kain kuat tahan lama, potongan rapi pas di pinggang, tanpa noda sama sekali.',
      rating: '4.8',
      price: '185.000',
      stock: 'Sisa 2 pcs',
      img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'
    },
    {
      id: 4,
      tag: 'Like New',
      category: 'Atasan Wanita',
      title: 'Blouse Sutra Zara Floral Pattern',
      desc: 'Sentuhan sutra sintetis lembut sejuk di kulit, aksen lengan pita anggun.',
      rating: '4.8',
      price: '110.000',
      stock: 'Sisa 1 pcs',
      img: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500'
    }
  ];

  return (
    <div className="bg-light py-4">
      
      {/* ========================================================
          KOTAK CONTAINER 1: HERO / BANNER UTAMA
         ======================================================== */}
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


      {/* ========================================================
          KOTAK CONTAINER 2: KATALOG & GRID PRODUK
         ======================================================== */}
      <Container className="mb-4">
        <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border">
          {/* Header Kategori */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0">Kategori Pilihan</h5>
            <small className="text-muted">Menampilkan {products.length} Produk Pilihan</small>
          </div>

          {/* Filter Buttons */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {categories.map((cat, idx) => (
              <Button
                key={idx}
                size="sm"
                style={{
                  backgroundColor: activeCategory === cat ? '#1e4d3b' : '#f8f9fa',
                  borderColor: activeCategory === cat ? '#1e4d3b' : '#dee2e6',
                  color: activeCategory === cat ? '#fff' : '#6c757d'
                }}
                className="rounded-pill px-3 py-1 fw-semibold"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Product Grid */}
          <Row className="g-4">
            {products.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 border shadow-sm rounded-3 overflow-hidden">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={item.img} 
                      style={{ height: '200px', objectFit: 'cover' }} 
                    />
                    <Badge 
                      bg="dark" 
                      className="position-absolute top-0 start-0 m-2 px-2 py-1 bg-opacity-75 font-monospace"
                      style={{ fontSize: '10px' }}
                    >
                      {item.tag}
                    </Badge>
                    <Button 
                      variant="light" 
                      className="position-absolute top-0 end-0 m-2 rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <BsHeart className="text-secondary" size={14} />
                    </Button>
                  </div>

                  <Card.Body className="d-flex flex-column p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted" style={{ fontSize: '11px' }}>{item.category}</small>
                      <small className="fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                        <BsStarFill className="text-warning" size={10} /> {item.rating}
                      </small>
                    </div>

                    <Card.Title className="fs-6 fw-bold text-dark text-truncate mb-1">
                      {item.title}
                    </Card.Title>

                    <Card.Text className="text-muted small mb-3" style={{ fontSize: '11px', height: '32px', overflow: 'hidden' }}>
                      {item.desc}
                    </Card.Text>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-baseline mb-2">
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: '10px' }}>Harga Thrift</span>
                          <span className="fw-bold text-dark fs-6">Rp {item.price}</span>
                        </div>
                        <Badge bg="secondary" className="bg-opacity-10 text-secondary fw-normal" style={{ fontSize: '10px' }}>
                          {item.stock}
                        </Badge>
                      </div>

                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm" className="p-2 d-flex align-items-center justify-content-center rounded-2">
                          <BsCart2 size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }} 
                          className="w-100 rounded-2 fw-semibold"
                        >
                          Beli Langsung
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>


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

export default DashboardContent;