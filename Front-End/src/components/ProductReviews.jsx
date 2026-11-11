import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Badge, Button, Card, Form, Spinner } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

const API_URL = (import.meta.env.VITE_URL_API || 'http://localhost:5000').replace(/\/+$/, '');

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const customerId = Number(localStorage.getItem('prelovedLastCustomerId'));

  const loadReviews = useCallback(() => axios.get(`${API_URL}/api/review/produk/${productId}`), [productId]);
  const showReviews = useCallback(response => {
    setReviews(response.data.data.reviews || []);
    setRating(response.data.data.rating);
    setReviewCount(response.data.data.review_count || 0);
  }, []);
  const reportLoadError = useCallback(requestError => {
    console.error('Gagal memuat ulasan produk:', requestError);
    setError(requestError.response?.data?.message || 'Ulasan belum dapat dimuat.');
  }, []);

  useEffect(() => {
    let active = true;
    loadReviews()
      .then(response => {
        if (active) showReviews(response);
      })
      .catch(requestError => {
        if (active) reportLoadError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [loadReviews, reportLoadError, showReviews]);

  const submitReview = async event => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');
    let submitted = false;
    try {
      await axios.post(`${API_URL}/api/review`, {
        id_customer: customerId,
        id_produk: productId,
        rating: score,
        komentar: comment.trim()
      });
      setComment('');
      setMessage('Terima kasih, ulasanmu berhasil dikirim.');
      setLoading(true);
      submitted = true;
    } catch (requestError) {
      console.error('Gagal mengirim ulasan:', requestError);
      setError(requestError.response?.data?.message || 'Ulasan gagal dikirim. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
    if (submitted) {
      try {
        showReviews(await loadReviews());
      } catch (requestError) {
        reportLoadError(requestError);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="border rounded-4 shadow-sm mt-4">
      <Card.Body className="p-4 p-md-5">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <Badge bg="success" className="bg-opacity-10 text-success mb-2">CERITA DARI PEMBELI</Badge>
            <h4 className="fw-bold mb-1">Ulasan pelanggan</h4>
            <p className="text-muted mb-0 small">Pengalaman nyata membantu pembeli lain memilih dengan yakin.</p>
          </div>
          <div className="text-end">
            <div className="d-flex align-items-center gap-2 justify-content-end">
              <BsStarFill className="text-warning" />
              <strong className="fs-4">{rating ?? '—'}</strong>
            </div>
            <small className="text-muted">{reviewCount} ulasan</small>
          </div>
        </div>

        {error && <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <span>{error}</span><Button variant="outline-danger" size="sm" onClick={() => {
            setLoading(true);
            setError('');
            loadReviews().then(showReviews).catch(reportLoadError).finally(() => setLoading(false));
          }}>Coba lagi</Button>
        </Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        {loading ? <div className="text-center py-4"><Spinner animation="border" variant="success" /></div> : (
          reviews.length === 0 ? <div className="text-center bg-light rounded-3 py-4 px-3 mb-4">
            <BsStarFill className="text-warning mb-2" />
            <p className="fw-semibold mb-1">Belum ada ulasan</p>
            <p className="small text-muted mb-0">Jadilah yang pertama membagikan pengalamanmu.</p>
          </div> : (
            <div className="mb-4">
              {reviews.map(review => (
                <div key={review.id_review} className="border-bottom py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{review.nama_customer}</strong>
                    <span className="small text-warning d-flex align-items-center gap-1">
                      <BsStarFill /> {review.rating}/5
                    </span>
                  </div>
                  <p className="text-muted mb-0">{review.komentar}</p>
                </div>
              ))}
            </div>
          )
        )}

        <div className="bg-light rounded-3 p-3 p-md-4">
          <h6 className="fw-bold mb-1">Bagikan pendapatmu</h6>
          {customerId ? (
            <Form onSubmit={submitReview}>
              <Form.Group className="my-3">
                <Form.Label className="small fw-semibold">Nilai produk</Form.Label>
                <div className="d-flex gap-2" role="group" aria-label="Pilih rating">
                  {[1, 2, 3, 4, 5].map(value => (
                    <Button key={value} type="button" variant="link" className="p-0 text-decoration-none" aria-label={`${value} bintang`} aria-pressed={score === value} onClick={() => setScore(value)}>
                      <BsStarFill className={value <= score ? 'text-warning' : 'text-secondary opacity-25'} size={22} />
                    </Button>
                  ))}
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Ceritakan pengalamanmu</Form.Label>
                <Form.Control as="textarea" rows={3} maxLength={2000} required value={comment} onChange={event => setComment(event.target.value)} placeholder="Bagaimana kondisi produk saat diterima?" />
                <Form.Text>{comment.length}/2000 karakter</Form.Text>
              </Form.Group>
              <Button type="submit" disabled={submitting || !comment.trim()} style={{ backgroundColor: '#1e4d3b', borderColor: '#1e4d3b' }}>
                {submitting ? 'Mengirim...' : 'Kirim ulasan'}
              </Button>
            </Form>
          ) : (
            <p className="text-muted small mb-0 mt-2">Selesaikan checkout terlebih dahulu untuk dapat menulis ulasan.</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductReviews;
