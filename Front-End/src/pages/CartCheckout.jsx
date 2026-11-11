import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { BsArrowLeft, BsCheckCircleFill, BsTrash } from 'react-icons/bs';
import Footer from '../components/Footer';
import Header from '../components/Navbar';
import { getCart, saveCart } from '../utils/cart';

const API_URL = (import.meta.env.VITE_URL_API || 'http://localhost:5000').replace(/\/+$/, '');
const productsUrl = `${API_URL}/api/produk`;
const formatCurrency = amount => `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;

const useCartProducts = () => {
  const [cart, setCart] = useState(getCart);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    const response = await axios.get(productsUrl);
    return Array.isArray(response.data.data) ? response.data.data : [];
  }, []);

  useEffect(() => {
    let active = true;
    loadProducts()
      .then(data => {
        if (active) setProducts(data);
      })
      .catch(requestError => {
        console.error('Gagal memuat produk keranjang:', requestError);
        if (active) setError(requestError.response?.data?.message || 'Gagal memuat keranjang. Periksa koneksi, lalu coba lagi.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [loadProducts]);

  const retryLoadProducts = () => {
    setLoading(true);
    setError('');
    loadProducts()
      .then(setProducts)
      .catch(requestError => {
        console.error('Gagal memuat produk keranjang:', requestError);
        setError(requestError.response?.data?.message || 'Gagal memuat keranjang. Periksa koneksi, lalu coba lagi.');
      })
      .finally(() => setLoading(false));
  };

  const items = useMemo(() => cart.map(entry => {
    const product = products.find(item => Number(item.id_produk) === entry.id_produk);
    return product ? {
      id: Number(product.id_produk),
      title: product.nama_produk,
      image: product.gambar_produk,
      price: Number(product.harga),
      stock: Number(product.stok),
      qty: entry.qty
    } : { id: entry.id_produk, qty: entry.qty, unavailable: true };
  }), [cart, products]);

  const updateQuantity = (id, qty) => {
    const product = products.find(item => Number(item.id_produk) === id);
    if (!product || qty < 1 || qty > Number(product.stok)) return;
    const nextCart = cart.map(item => item.id_produk === id ? { ...item, qty } : item);
    setCart(nextCart);
    saveCart(nextCart);
  };

  const removeItem = id => {
    const nextCart = cart.filter(item => item.id_produk !== id);
    setCart(nextCart);
    saveCart(nextCart);
  };

  return { cart, items, loading, error, retryLoadProducts, updateQuantity, removeItem };
};

const CartPage = () => {
  const { items, loading, error, retryLoadProducts, updateQuantity, removeItem } = useCartProducts();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + (item.unavailable ? 0 : item.price * item.qty), 0);
  const hasUnavailableItem = items.some(item => item.unavailable || item.stock < item.qty);

  return (
    <>
      <Header />
      <main className="bg-light py-5 min-vh-75">
        <Container>
          <Button as={Link} to="/" variant="link" className="text-success text-decoration-none px-0 mb-3">
            <BsArrowLeft className="me-2" />Lanjut belanja
          </Button>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <Badge bg="success" className="bg-opacity-10 text-success mb-2">KERANJANG BELANJA</Badge>
              <h1 className="fw-bold mb-1">Pilihan preloved-mu</h1>
              <p className="text-muted mb-0">Item unik pilihanmu tersimpan di sini.</p>
            </div>
            <span className="text-muted">{items.length} produk</span>
          </div>

          {error && <Alert variant="danger" className="d-flex justify-content-between align-items-center">
            {error}<Button variant="outline-danger" size="sm" onClick={retryLoadProducts}>Coba lagi</Button>
          </Alert>}
          {loading ? <div className="text-center py-5"><Spinner animation="border" variant="success" /></div> : (
            items.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-4 text-center py-5">
                <Card.Body>
                  <div className="display-5 mb-3">🛍️</div>
                  <h4 className="fw-bold">Keranjangmu masih kosong</h4>
                  <p className="text-muted">Temukan item vintage favorit dan beri kehidupan kedua.</p>
                  <Button as={Link} to="/" className="rounded-pill px-4" style={{ backgroundColor: '#1e4d3b' }}>Jelajahi produk</Button>
                </Card.Body>
              </Card>
            ) : (
              <Row className="g-4 align-items-start">
                <Col lg={8}>
                  <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body className="p-3 p-md-4">
                      {items.map(item => (
                        <div key={item.id} className="d-flex gap-3 py-3 border-bottom">
                          {item.unavailable ? (
                            <div className="rounded-3 bg-light d-flex align-items-center justify-content-center text-muted" style={{ width: 100, height: 110 }}>Tidak tersedia</div>
                          ) : (
                            <img src={item.image} alt={item.title} className="rounded-3 object-fit-cover" style={{ width: 100, height: 110 }} />
                          )}
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between gap-2">
                              <div>
                                <span className="small text-muted">Preloved pilihan</span>
                                <h6 className="fw-bold mt-1 mb-1">{item.title || `Produk #${item.id}`}</h6>
                                {item.unavailable ? (
                                  <Badge bg="danger">Produk sudah tidak tersedia</Badge>
                                ) : item.stock < item.qty ? (
                                  <Badge bg="warning" text="dark">Stok tersisa {item.stock}</Badge>
                                ) : <span className="text-muted small">Stok tersedia: {item.stock}</span>}
                              </div>
                              <Button variant="link" className="text-muted p-0 align-self-start" aria-label="Hapus produk" onClick={() => removeItem(item.id)}><BsTrash /></Button>
                            </div>
                            {!item.unavailable && (
                              <div className="d-flex justify-content-between align-items-end mt-3">
                                <div className="btn-group btn-group-sm" role="group" aria-label={`Jumlah ${item.title}`}>
                                  <Button variant="outline-secondary" disabled={item.qty <= 1} onClick={() => updateQuantity(item.id, item.qty - 1)}>-</Button>
                                  <Button variant="light" disabled>{item.qty}</Button>
                                  <Button variant="outline-secondary" disabled={item.qty >= item.stock} onClick={() => updateQuantity(item.id, item.qty + 1)}>+</Button>
                                </div>
                                <strong>{formatCurrency(item.price * item.qty)}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-4">Ringkasan pesanan</h5>
                      <div className="d-flex justify-content-between text-muted mb-3"><span>Subtotal produk</span><span>{formatCurrency(total)}</span></div>
                      <div className="d-flex justify-content-between text-muted mb-3"><span>Pengiriman</span><span>Dihitung saat checkout</span></div>
                      <hr />
                      <div className="d-flex justify-content-between fw-bold fs-5 mb-4"><span>Total</span><span className="text-success">{formatCurrency(total)}</span></div>
                      <Button className="w-100 py-3 fw-semibold" disabled={hasUnavailableItem || total <= 0} onClick={() => navigate('/checkout')} style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }}>
                        Lanjut ke checkout
                      </Button>
                      {hasUnavailableItem && <p className="small text-danger mt-3 mb-0">Hapus produk yang tidak tersedia atau sesuaikan jumlah stok untuk melanjutkan.</p>}
                      <p className="small text-muted text-center mt-3 mb-0">Pembelianmu membantu memperpanjang siklus hidup pakaian.</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

const CheckoutPage = () => {
  const { items, loading, error } = useCartProducts();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({
    nama_customer: '',
    email_customer: '',
    telpon_customer: '',
    alamat_customer: ''
  });
  const validItems = items.filter(item => !item.unavailable && item.stock >= item.qty);
  const total = validItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = event => {
    setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await axios.post(`${API_URL}/api/transaksi`, {
        customer: form,
        items: validItems.map(item => ({ id_produk: item.id, qty: item.qty }))
      });
      if (!response.data.success) throw new Error(response.data.message || 'Pesanan gagal diproses');
      const order = response.data.data;
      localStorage.setItem('prelovedLastOrder', JSON.stringify(order));
      localStorage.setItem('prelovedLastCustomerId', String(order.id_customer));
      saveCart([]);
      navigate('/order-complete', { state: { order } });
    } catch (requestError) {
      console.error('Gagal membuat pesanan:', requestError);
      setSubmitError(requestError.response?.data?.message || requestError.message || 'Gagal memproses pesanan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-light py-5 min-vh-75">
        <Container>
          <Button variant="link" className="text-success text-decoration-none px-0 mb-3" onClick={() => navigate('/cart')}><BsArrowLeft className="me-2" />Kembali ke keranjang</Button>
          <Badge bg="success" className="bg-opacity-10 text-success mb-2">LANGKAH TERAKHIR</Badge>
          <h1 className="fw-bold mb-4">Selesaikan pesanan</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && items.length === 0 && <Alert variant="warning">Keranjang kosong. Tambahkan produk sebelum checkout.</Alert>}
          {!loading && items.some(item => item.unavailable || item.stock < item.qty) && <Alert variant="warning">Stok salah satu produk berubah. Perbarui keranjang sebelum checkout.</Alert>}
          {loading ? <div className="text-center py-5"><Spinner animation="border" variant="success" /></div> : (
            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col lg={7}>
                  <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body className="p-4 p-md-5">
                      <h5 className="fw-bold mb-4">Informasi penerima</h5>
                      {submitError && <Alert variant="danger">{submitError}</Alert>}
                      <Form.Group className="mb-3">
                        <Form.Label>Nama lengkap</Form.Label>
                        <Form.Control required name="nama_customer" value={form.nama_customer} onChange={handleChange} maxLength={100} placeholder="Nama penerima" />
                      </Form.Group>
                      <Row>
                        <Col md={6}><Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control required type="email" name="email_customer" value={form.email_customer} onChange={handleChange} maxLength={100} placeholder="nama@email.com" />
                        </Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3">
                          <Form.Label>Nomor telepon</Form.Label>
                          <Form.Control required type="tel" name="telpon_customer" value={form.telpon_customer} onChange={handleChange} maxLength={20} placeholder="08xxxxxxxxxx" />
                        </Form.Group></Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Alamat pengiriman</Form.Label>
                        <Form.Control required as="textarea" rows={4} name="alamat_customer" value={form.alamat_customer} onChange={handleChange} maxLength={255} placeholder="Nama jalan, nomor rumah, kelurahan, kecamatan, kota, kode pos" />
                      </Form.Group>
                      <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 small">📦 Pesanan akan diproses setelah data penerima tersimpan.</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={5}>
                  <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-4">Pesananmu</h5>
                      {validItems.map(item => <div key={item.id} className="d-flex gap-3 mb-3">
                        <img src={item.image} alt={item.title} className="rounded-3 object-fit-cover" style={{ width: 58, height: 64 }} />
                        <div className="flex-grow-1"><div className="fw-semibold small">{item.title}</div><div className="text-muted small">{item.qty} × {formatCurrency(item.price)}</div></div>
                        <strong className="small">{formatCurrency(item.qty * item.price)}</strong>
                      </div>)}
                      <hr />
                      <div className="d-flex justify-content-between text-muted mb-3"><span>Subtotal produk</span><span>{formatCurrency(total)}</span></div>
                      <div className="d-flex justify-content-between text-muted mb-3"><span>Pengiriman</span><span>Dikonfirmasi admin</span></div>
                      <div className="d-flex justify-content-between fw-bold fs-5 mb-4"><span>Total</span><span className="text-success">{formatCurrency(total)}</span></div>
                      <Button type="submit" className="w-100 py-3 fw-semibold" disabled={submitting || !validItems.length || items.length !== validItems.length} style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }}>
                        {submitting ? <><Spinner size="sm" className="me-2" />Memproses pesanan...</> : 'Buat pesanan'}
                      </Button>
                      <p className="small text-muted mt-3 mb-0">Stok hanya akan dikurangi setelah pesanan berhasil disimpan.</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Form>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

const OrderCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order] = useState(() => {
    if (location.state?.order) return location.state.order;
    try {
      return JSON.parse(localStorage.getItem('prelovedLastOrder') || 'null');
    } catch (error) {
      console.error('Gagal membaca data pesanan:', error);
      return null;
    }
  });

  return (
    <>
      <Header />
      <main className="bg-light py-5 min-vh-75">
        <Container className="py-4">
          <Card className="border-0 shadow-sm rounded-4 mx-auto text-center" style={{ maxWidth: 650 }}>
            <Card.Body className="p-4 p-md-5">
              <BsCheckCircleFill className="text-success mb-3" size={56} />
              <Badge bg="success" className="bg-opacity-10 text-success mb-3">PESANAN TERCATAT</Badge>
              <h1 className="fw-bold">Terima kasih sudah memilih preloved!</h1>
              {order ? <>
                <p className="text-muted">Pesanan <strong>#{order.id_transaksi}</strong> berhasil dibuat dan menunggu konfirmasi admin.</p>
                <div className="bg-light rounded-3 p-3 my-4 d-flex justify-content-between">
                  <span>Total pesanan</span><strong className="text-success">{formatCurrency(order.total_pembayaran)}</strong>
                </div>
                <p className="small text-muted">Simpan nomor pesananmu untuk memudahkan tindak lanjut.</p>
              </> : <p className="text-muted">Data pesanan tidak ditemukan. Periksa daftar pesanan atau hubungi admin.</p>}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
                <Button variant="outline-success" onClick={() => navigate('/')}>Kembali ke katalog</Button>
                {order?.items?.[0] && <Button onClick={() => {
                  localStorage.setItem('currentView', 'detail');
                  localStorage.setItem('selectedProductId', String(order.items[0].id_produk));
                  navigate('/');
                  window.dispatchEvent(new Event('storage'));
                }} style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }}>Beri ulasan produk</Button>}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export { CartPage, CheckoutPage, OrderCompletePage };
