import React, { useEffect, useState } from 'react';
import Header from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import { Container, Row, Col, Button, Badge, Card, Spinner, Alert } from 'react-bootstrap';
import { BsHeart, BsStarFill, BsCart2 } from 'react-icons/bs';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(['Semua Pakaian']);
    const [activeCategory, setActiveCategory] = useState('Semua Pakaian');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Data Produk dari API
    useEffect(() => {
        const fetchProducts = async () => {
        try {
            setLoading(true);

            // GANTI URL INI DENGAN ENDPOINT API ANDA
            const response = await fetch('/api/products');

            if (!response.ok) {
            throw new Error('Gagal mengambil data produk');
            }

            const data = await response.json();
            setProducts(data);

            // Otomatis buat daftar kategori unik berdasarkan data dari API
            const uniqueCategories = ['Semua Pakaian', ...new Set(data.map((item) => item.category))];
            setCategories(uniqueCategories);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    // Filter produk berdasarkan kategori aktif
    const filteredProducts = activeCategory === 'Semua Pakaian'
        ? products
        : products.filter((item) => item.category === activeCategory);
        
    return (
        <>
        <div>
            <Header />
        </div>

        <div>
            <Banner />
        </div>

        <div className="bg-light py-4">
            <Container>
                <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border">
                    {/* Header Kategori */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Kategori Pilihan</h5>
                    <small className="text-muted">
                        Menampilkan {filteredProducts.length} Produk
                    </small>
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
                            color: activeCategory === cat ? '#fff' : '#6c757d',
                        }}
                        className="rounded-pill px-3 py-1 fw-semibold"
                        onClick={() => setActiveCategory(cat)}
                        >
                        {cat}
                        </Button>
                    ))}
                    </div>

                    {/* State Loading */}
                    {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-2 text-muted">Memuat produk...</p>
                    </div>
                    )}

                    {/* State Error */}
                    {error && (
                    <Alert variant="danger" className="my-3">
                        {error}
                    </Alert>
                    )}

                    {/* State Produk Kosong */}
                    {!loading && !error && filteredProducts.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-muted mb-0">Tidak ada produk untuk kategori ini.</p>
                    </div>
                    )}

                    {/* Product Grid */}
                    {!loading && !error && (
                    <Row className="g-4">
                        {filteredProducts.map((item) => (
                        <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100 border shadow-sm rounded-3 overflow-hidden">
                                <div className="position-relative">
                                    <Card.Img
                                    variant="top"
                                    src={item.img}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    alt={item.title}
                                    />
                                    {item.tag && (
                                    <Badge
                                        bg="dark"
                                        className="position-absolute top-0 start m-2 px-2 py-1 bg-opacity-75 font-monospace"
                                        style={{ fontSize: '10px' }}
                                    >
                                        {item.tag}
                                    </Badge>
                                    )}
                                    <Button
                                        variant="light"
                                        className="position-absolute top-0 end m-2 rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm"
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
                                            <span className="text-muted d-block" style={{ fontSize: '10px' }}>
                                                Harga Thrift
                                            </span>
                                            <span className="fw-bold text-dark fs-6">
                                                Rp {typeof item.price === 'number' ? item.price.toLocaleString('id-ID') : item.price}
                                            </span>
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
                    )}
                </div>
            </Container>
        </div>

        <div>
            <Footer />
        </div>
        </>
    );
}
export default Dashboard;
