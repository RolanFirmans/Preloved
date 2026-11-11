import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

import { 
  BsHeart, 
  BsStarFill, 
  BsCart2, 
  BsShieldCheck, 
  BsFlower1, 
  BsBoxSeam,
  BsCheckCircleFill,
  BsBagCheck,
  BsChevronDown,
  BsChevronUp,
  BsArrowLeft
} from 'react-icons/bs';

import Header from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import ProductReviews from '../components/ProductReviews';
import { addToCart } from '../utils/cart';

const Dashboard = () => {
  const navigate = useNavigate();
  const URL = (import.meta.env.VITE_URL_API || 'http://localhost:5000').replace(/\/+$/, '');
  const link = `${URL}/api/produk`;
  const linkKateg = `${URL}/api/kategori`;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Semua Pakaian']);
  const [activeCategory, setActiveCategory] = useState('Semua Pakaian');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk kontrol tampilan Detail Produk (Show/Hide)
  const [currentView, setCurrentView] = useState (() => {
    return localStorage.getItem('currentView') || 'list';
  })
  
  const [selectedProductId, setSelectedProductId] = useState(() => {
    const savedId = localStorage.getItem('selectedProductId');
    return savedId ? Number(savedId) : null;
  });  
  // State untuk Detail Produk Spesifik
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [cartFeedback, setCartFeedback] = useState(null);

  // Memuat data ketika halaman dibuka
  useEffect(() => {
    LoadData();
  }, []);
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    if (selectedProductId) {
      localStorage.setItem('selectedProductId', selectedProductId);
    } else {
      localStorage.removeItem('selectedProductId');
    }
  }, [currentView, selectedProductId]);
  // Memuat data detail produk saat selectedProductId berubah
  useEffect(() => {
    if (currentView === 'detail' && selectedProductId) {
      LoadDetailProduct(selectedProductId);
    }
  }, [currentView, selectedProductId]);

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
        headers: { 'Content-Type': 'application/json' }
      });

      const responseKateg = await axios({
        url: linkKateg,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const apiProduk = responseProduk.data;
      const apiKateg = responseKateg.data;

      const dataProduk = Array.isArray(apiProduk.data) ? apiProduk.data : [];
      const dataKateg = Array.isArray(apiKateg.data) ? apiKateg.data : [];

      const prosesProduk = dataProduk.map(item => ({
        id: item.id_produk,
        title: item.nama_produk,
        category: item.kategori_produk,
        price: Number(item.harga) || 0,
        stock: Number(item.stok) || 0,
        img: GetImage(item.gambar_produk),
        tag: item.grade_produk || '',
        desc: item.deskripsi_produk || '',
        rating: item.rating ?? null,
        reviewCount: Number(item.review_count) || 0
      }));

      setProducts(prosesProduk);

      const listKateg = dataKateg
        .map(item => (typeof item === 'string' ? item : item.kategori_produk))
        .filter(Boolean);

      setCategories(['Semua Pakaian', ...new Set(listKateg)]);
    } catch (err) {
      console.error('Error API Dashboard:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data produk dan kategori');
    } finally {
      setLoading(false);
    }
  };

  const LoadDetailProduct = async (id) => {
    setDetailLoading(true);
    setDetailError('');
    try {
      const response = await axios.get(`${link}/${id}`);
      if (response.data.success) {
        const item = response.data.data;
        
        // Memproses gambar galeri jika ada
        const galeriFormatted = (item.galeri_foto || []).map(g => ({
          id_gambar: g.id_gambar,
          url_gambar: GetImage(g.nama_file_gambar)
        }));

        const formattedDetail = {
          id: item.id_produk,
          title: item.nama_produk,
          category: item.kategori_produk,
          price: Number(item.harga) || 0,
          stock: Number(item.stok) || 0,
          img: GetImage(item.gambar_produk),
          tag: item.grade_produk || 'A',
          desc: item.deskripsi_produk || 'Kondisi mulus, pemakaian wajar.',
          rating: item.rating == null ? null : Number(item.rating),
          reviewCount: Number(item.review_count) || 0,
          galeri: galeriFormatted
        };

        setDetailProduct(formattedDetail);
        setMainImage(formattedDetail.img);
      } else {
        throw new Error('Gagal memuat detail produk');
      }
    } catch (err) {
      console.error('Error Detail API:', err);
      setDetailError(err.response?.data?.message || 'Gagal mengambil detail produk');
    } finally {
      setDetailLoading(false);
    }
  };

  // Navigasi ke Detail
  const handleOpenDetail = (id) => {
    setSelectedProductId(id);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Kembali ke List
 const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProductId(null);
    setDetailProduct(null);
    localStorage.removeItem('currentView');
    localStorage.removeItem('selectedProductId');
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleAddToCart = (product, checkoutNow = false) => {
    const result = addToCart(product);
    setCartFeedback({
      variant: result.success ? 'success' : 'warning',
      message: result.success ? `${product.title} ditambahkan ke keranjang.` : result.message
    });
    if (result.success && checkoutNow) navigate('/checkout');
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

      {cartFeedback && currentView === 'list' && (
        <Container className="pt-3">
          <Alert variant={cartFeedback.variant} dismissible onClose={() => setCartFeedback(null)} className="mb-0">
            {cartFeedback.message} {cartFeedback.variant === 'success' && <Button variant="link" className="p-0 ms-1 text-success fw-semibold" onClick={() => navigate('/cart')}>Lihat keranjang</Button>}
          </Alert>
        </Container>
      )}

      {/* Banner hanya muncul di mode list */}
      {currentView === 'list' && (
        <div>
          <Banner />
        </div>
      )}

      <div className="bg-light py-4">
        {/* KONDISI SHOW / HIDE: LIST VS DETAIL */}
        {currentView === 'list' ? (
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
              <Alert variant="danger" className="my-3 d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <Button variant="outline-danger" size="sm" onClick={LoadData}>
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
                            style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                            alt={item.title}
                            onClick={() => handleOpenDetail(item.id)}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center bg-light text-muted"
                            style={{ height: '200px', cursor: 'pointer' }}
                            onClick={() => handleOpenDetail(item.id)}
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
                          <small className="text-muted" style={{ fontSize: '11px' }}>
                            {item.category}
                          </small>
                          {item.rating !== null && (
                            <small className="fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                              <BsStarFill className="text-warning" size={10} />
                              {item.rating}
                            </small>
                          )}
                        </div>

                        <Card.Title 
                          className="fs-6 fw-bold text-dark text-truncate mb-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleOpenDetail(item.id)}
                        >
                          {item.title}
                        </Card.Title>

                        <Card.Text
                          className="text-muted small mb-3"
                          style={{ fontSize: '11px', height: '32px', overflow: 'hidden' }}
                        >
                          {item.desc}
                        </Card.Text>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-baseline mb-2">
                            <div>
                              <span className="text-muted d-block" style={{ fontSize: '10px' }}>
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
                              disabled={item.stock < 1}
                              aria-label={`Tambah ${item.title} ke keranjang`}
                              onClick={() => handleAddToCart(item)}
                            >
                              <BsCart2 size={16} />
                            </Button>

                            <Button
                              size="sm"
                              style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }}
                              className="w-100 rounded-2 fw-semibold"
                              onClick={() => handleOpenDetail(item.id)}
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
        ) : (
          /* TAMPILAN DETAIL PRODUK */
          <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleBackToList}
                className="d-flex align-items-center gap-2 rounded-pill px-3"
              >
                <BsArrowLeft /> Kembali ke Katalog
              </Button>

              <div className="text-xs text-muted d-none d-md-block">
                Beranda &gt; {detailProduct?.category} &gt; {detailProduct?.title}
              </div>
            </div>

            {detailLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted">Memuat detail produk...</p>
              </div>
            ) : detailError ? (
              <Alert variant="danger">
                <span>{detailError}</span>
                <div className="mt-3">
                  <Button variant="outline-danger" size="sm" onClick={() => LoadDetailProduct(selectedProductId)}>
                    Coba Lagi
                  </Button>
                </div>
              </Alert>
            ) : detailProduct && (
              <Row className="g-5">
                <Col lg={7}>
                  <div className="bg-white p-3 rounded-4 position-relative border shadow-sm mb-4">
                    <div className="position-absolute top-0 start-0 m-4 d-flex gap-2 z-1">
                      <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: '12px' }}>
                        ✓ {detailProduct.tag}
                      </Badge>
                      <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: '12px' }}>
                        ✓ Cuci Bersih & Steril
                      </Badge>
                    </div>

                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-4 rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center z-1"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <BsHeart size={18} className="text-secondary" />
                    </Button>

                    <img 
                      src={mainImage || detailProduct.img} 
                      alt={detailProduct.title} 
                      className="w-full rounded-3 object-fit-contain"
                      style={{ height: '420px', width: '100%' }}
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-3">
                      <div 
                        className={`border rounded-3 p-1 cursor-pointer bg-white ${mainImage === detailProduct.img ? 'border-success border-2' : ''}`}
                        onClick={() => setMainImage(detailProduct.img)}
                        style={{ height: '90px' }}
                      >
                        <img src={detailProduct.img} alt="Thumb Utama" className="w-100 h-100 object-fit-cover rounded-2" />
                      </div>
                    </div>
                    {detailProduct.galeri.map((foto) => (
                      <div key={foto.id_gambar} className="col-3">
                        <div 
                          className={`border rounded-3 p-1 cursor-pointer bg-white ${mainImage === foto.url_gambar ? 'border-success border-2' : ''}`}
                          onClick={() => setMainImage(foto.url_gambar)}
                          style={{ height: '90px' }}
                        >
                          <img src={foto.url_gambar} alt={`Thumb Galeri ${foto.id_gambar}`} className="w-100 h-100 object-fit-cover rounded-2" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 mt-4 rounded-4 border d-flex align-items-center justify-content-between shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle">
                        <BsCheckCircleFill size={22} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '14px' }}>Dampak Positif Pakaian Ini</h6>
                        <small className="text-muted" style={{ fontSize: '12px' }}>Hemat 2.100 Liter air bersih & 3.2 kg CO₂ jejak karbon.</small>
                      </div>
                    </div>
                    <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-normal" style={{ fontSize: '11px' }}>
                      Certified Eco-Preloved
                    </Badge>
                  </div>
                </Col>

                <Col lg={5}>
                  <div className="d-flex justify-content-between align-items-center text-muted mb-2" style={{ fontSize: '12px' }}>
                    <span>{detailProduct.category.toUpperCase()} • VINTAGE THRIFT</span>
                    <span className="fw-semibold">SKU: PLH-UQ-{detailProduct.id}</span>
                  </div>

                  <h3 className="fw-bold text-dark mb-2">{detailProduct.title}</h3>

                  <div className="d-flex align-items-center gap-3 mb-4 text-muted" style={{ fontSize: '13px' }}>
                    <div className="d-flex align-items-center gap-1 text-dark fw-bold">
                      <BsStarFill className="text-warning" size={14} />
                      <span>{detailProduct.rating ?? 'Belum ada rating'}</span>
                    </div>
                    <span>({detailProduct.reviewCount} ulasan pembeli)</span>
                  </div>

                  <div className="bg-light p-4 rounded-4 border mb-4">
                    <div className="d-flex align-items-baseline gap-3 mb-1">
                      <h3 className="fw-bold text-success mb-0">
                        Rp {detailProduct.price.toLocaleString('id-ID')}
                      </h3>
                    </div>
                    <small className="text-muted" style={{ fontSize: '12px' }}>
                      Harga transparan sesuai kondisi dan kurasi produk.
                    </small>
                  </div>

                  <div className="p-3 rounded-3 mb-4 border" style={{ backgroundColor: '#fff9e6', borderColor: '#ffe6b3' }}>
                    <div className="d-flex align-items-center gap-2 text-dark" style={{ fontSize: '13px' }}>
                      <span>⚠️</span>
                      <div>
                        <strong className="text-dark">Sisa {detailProduct.stock} Pcs.</strong>
                        <span className="text-muted ms-1">Setiap item preloved tersedia terbatas.</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                      <BsBagCheck className="text-success" /> Spesifikasi Dimensi & Material
                    </h6>
                    <Row className="g-2">
                      <Col xs={6}>
                        <div className="bg-light p-3 rounded-3 border">
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>Panjang x Lebar</small>
                          <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>74 cm x 56 cm</span>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="bg-light p-3 rounded-3 border">
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>Ukuran Label</small>
                          <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>L Regular Fit</span>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="bg-light p-3 rounded-3 border">
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>Komposisi Bahan</small>
                          <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>100% Brushed Cotton</span>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="bg-light p-3 rounded-3 border">
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>Palet Corak</small>
                          <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>Navy Tartan Plaid</span>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="mb-4 text-muted" style={{ fontSize: '13px' }}>
                    <strong>Deskripsi:</strong> {detailProduct.desc}
                  </div>

                  <div className="mb-4">
                    <div className="border rounded-3 mb-2 overflow-hidden">
                      <div 
                        className="p-3 bg-light d-flex justify-content-between align-items-center cursor-pointer fw-semibold text-dark"
                        onClick={() => toggleAccordion(0)}
                        style={{ fontSize: '13px', cursor: 'pointer' }}
                      >
                        <span>Laporan Kurasi & Kondisi Kain</span>
                        {openAccordion === 0 ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
                      </div>
                      {openAccordion === 0 && (
                        <div className="p-3 border-top text-muted" style={{ fontSize: '12px' }}>
                          Lolos uji kualitas 12 titik tanpa noda membandel, kancing lengkap, dan jahitan kuat.
                        </div>
                      )}
                    </div>

                    <div className="border rounded-3 overflow-hidden">
                      <div 
                        className="p-3 bg-light d-flex justify-content-between align-items-center cursor-pointer fw-semibold text-dark"
                        onClick={() => toggleAccordion(1)}
                        style={{ fontSize: '13px', cursor: 'pointer' }}
                      >
                        <span>Pengemasan Ramah Lingkungan</span>
                        {openAccordion === 1 ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
                      </div>
                      {openAccordion === 1 && (
                        <div className="p-3 border-top text-muted" style={{ fontSize: '12px' }}>
                          Dikemas menggunakan polybag 100% biodegradable yang aman untuk lingkungan.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <Button variant="outline-dark" disabled={detailProduct.stock < 1} onClick={() => handleAddToCart(detailProduct)} className="w-50 py-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2">
                      <BsCart2 size={18} /> Tambah ke Keranjang
                    </Button>
                    <Button disabled={detailProduct.stock < 1} onClick={() => handleAddToCart(detailProduct, true)} className="w-50 py-3 rounded-3 fw-semibold text-white d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }}>
                      <BsBagCheck size={18} /> Beli Sekarang
                    </Button>
                  </div>

                  <div className="text-center text-muted" style={{ fontSize: '12px' }}>
                    <span>✓ Jaminan Original 100% &nbsp;&nbsp;&bull;&nbsp;&nbsp; ✓ Retur Mudah 48 Jam</span>
                  </div>
                </Col>
              </Row>
            )}
            {detailProduct && !detailLoading && !detailError && <ProductReviews productId={detailProduct.id} />}
          </div>
        )}
      </div>

      {/* Info Keunggulan hanya muncul di mode list */}
      {currentView === 'list' && (
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
      )}

      <div>
        <Footer />
      </div>
    </>
  );
};

export class DashboardExport {
  // Helper dummy class jika diperlukan
}

export default Dashboard;

sdsdhsjdajdhsakjdhsakj