
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
import Banner from '../components/Banner';
import Footer from '../components/Footer';

const Dashboard = () => {
  const URL = (import.meta.env.VITE_URL_API || 'http://localhost:5000').replace(/\/+$/, '');
  const link = `${URL}/api/produk`;
  const linkKateg = `${URL}/api/kategori`;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Semua Pakaian']);
  const [activeCategory, setActiveCategory] = useState('Semua Pakaian');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Memuat data ketika halaman dibuka
  useEffect(() => {
    LoadData();
  }, []);

  const GetImage = gambar => {
    if (!gambar) return '';

    if (gambar.startsWith('http://') || gambar.startsWith('https://')) {
      return gambar;
    }

    if (gambar.startsWith('/')) {
      return `${URL}${gambar}`;
    }

    return `${URL}/uploads/products/${gambar}`;
  };

 
  const LoadData = async () => {
    setLoading(true);
    setError('');

    try {
      const responseProduk = await axios({
        url: link,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseKateg = await axios({
        url: linkKateg,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const apiProduk = responseProduk.data;
      const apiKateg = responseKateg.data;

      const dataProduk = Array.isArray(apiProduk.data)
        ? apiProduk.data
        : [];

      const dataKateg = Array.isArray(apiKateg.data)
        ? apiKateg.data
        : [];

      const prosesProduk = dataProduk.map(item => ({
        id: item.id_produk,
        title: item.nama_produk,
        category: item.kategori_produk,
        price: Number(item.harga) || 0,
        stock: Number(item.stok) || 0,
        img: GetImage(item.gambar_produk),
        tag: item.grade_produk || '',
        desc: item.deskripsi_produk || '',
        rating: item.rating ?? null
      }));

      setProducts(prosesProduk);

      // Membuat daftar kategori unik dari API kategori
      const listKateg = dataKateg
        .map(item =>
          typeof item === 'string'
            ? item
            : item.kategori_produk
        )
        .filter(Boolean);

      setCategories([
        'Semua Pakaian',
        ...new Set(listKateg)
      ]);

    } catch (err) {
      console.error('Error API Dashboard:', err);

      setError(
        err.response?.data?.message ||
        'Gagal mengambil data produk dan kategori'
      );

    } finally {
      setLoading(false);
    }
  };


  // Filter produk berdasarkan kategori aktif
  const filteredProducts = activeCategory === 'Semua Pakaian'
    ? products
    : products.filter(item => item.category === activeCategory);

  return (
    <>
      <div>
        <Header />
      </div>

      <div>
        <Banner />
      </div>

      <div className="bg-light py-4">
        <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border">
          {/* Header Kategori */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">
                Kategori Pilihan
              </h5>

              <small className="text-muted">
                Menampilkan {filteredProducts.length} Produk
              </small>
            </div>

          {/* Filter Kategori */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <Button
                  key={cat}
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

            {/* Loading */}
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-2 text-muted">Memuat produk...</p>
                </div>
              )}

            {/* Error */}
              {error && (
                <Alert
                  variant="danger"
                  className="my-3 d-flex justify-content-between align-items-center"
                >
                  <span>{error}</span>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={LoadData}
                  >
                    Coba Lagi
                  </Button>
                </Alert>
              )}

            {/* Produk Kosong */}
              {!loading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">
                    Tidak ada produk untuk kategori ini.
                  </p>
                </div>
              )}

            {/* Grid Produk */}
              {!loading && !error && (
                <Row className="g-4">
                  {filteredProducts.map(item => (
                    <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                      <Card className="h-100 border shadow-sm rounded-3 overflow-hidden">

                        <div className="position-relative">
                          {item.img ? (
                            <Card.Img
                              variant="top"
                              src={item.img}
                              style={{
                                height: '200px',
                                objectFit: 'cover'
                              }}
                              alt={item.title}
                            />
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center bg-light text-muted"
                              style={{ height: '200px' }}
                            >
                              Gambar belum tersedia
                            </div>
                          )}

                          {item.tag && (
                            <Badge
                              bg="dark"
                              className="position-absolute top-0 start-0 m-2 px-2 py-1"
                              style={{ fontSize: '10px' }}
                            >
                              {item.tag}
                            </Badge>
                          )}

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
                            <small
                              className="text-muted"
                              style={{ fontSize: '11px' }}
                            >
                              {item.category}
                            </small>

                            {item.rating !== null && (
                              <small
                                className="fw-bold text-dark d-flex align-items-center gap-1"
                                style={{ fontSize: '11px' }}
                              >
                                <BsStarFill className="text-warning" size={10} />
                                {item.rating}
                              </small>
                            )}
                          </div>

                          <Card.Title className="fs-6 fw-bold text-dark text-truncate mb-1">
                            {item.title}
                          </Card.Title>

                          <Card.Text
                            className="text-muted small mb-3"
                            style={{
                              fontSize: '11px',
                              height: '32px',
                              overflow: 'hidden'
                            }}
                          >
                            {item.desc}
                          </Card.Text>

                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-baseline mb-2">
                              <div>
                                <span
                                  className="text-muted d-block"
                                  style={{ fontSize: '10px' }}
                                >
                                  Harga Thrift
                                </span>

                                <span className="fw-bold text-dark fs-6">
                                  Rp {item.price.toLocaleString('id-ID')}
                                </span>
                              </div>

                              <Badge
                                bg="secondary"
                                className="bg-opacity-10 text-secondary fw-normal"
                                style={{ fontSize: '10px' }}
                              >
                                Stok: {item.stock}
                              </Badge>
                            </div>

                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="p-2 d-flex align-items-center justify-content-center rounded-2"
                              >
                                <BsCart2 size={16} />
                              </Button>

                              <Button
                                size="sm"
                                style={{
                                  backgroundColor: '#1e4d3b',
                                  borderColor: '#1e4d3b'
                                }}
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
              )}
        </div>

        <div className="bg-light py-4">
          <div className="bg-gray-50 rounded-4 p-4 shadow-sm border">
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
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;