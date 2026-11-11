import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const URL = (import.meta.env.VITE_URL_API || 'http://localhost:5000').replace(/\/+$/, '');
  const link = `${URL}/api/produk`;
  const linkKateg = `${URL}/api/kategori`;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Semua Pakaian']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- STATE UNTUK FILTER & PENCARIAN TABEL ---
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTableCategory, setActiveTableCategory] = useState('Semua');

  // State untuk form tambah produk
  const [formData, setFormData] = useState({
    nama_produk: '',
    kategori_produk: '',
    harga: '',
    stok: 1,
    grade_produk: 'Like New (9.5/10)',
    deskripsi_produk: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editGalleryFiles, setEditGalleryFiles] = useState([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [actionError, setActionError] = useState('');

  // Memuat data ketika halaman dibuka
  useEffect(() => {
    LoadData();
  }, []);

  const GetImage = (gambar) => {
    if (!gambar) return '';
    if (gambar.startsWith('http://') || gambar.startsWith('https://')) return gambar;
    if (gambar.startsWith('/')) return `${URL}${gambar}`;
    return `${URL}/uploads/products/${gambar}`;
  };

  const LoadData = async () => {
    setLoading(true);
    setError('');

    try {
      const responseProduk = await axios.get(link, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      let apiKateg = { data: [] };
      try {
        const responseKateg = await axios.get(linkKateg, {
          headers: { 'Content-Type': 'application/json' }
        });
        apiKateg = responseKateg.data;
      } catch (catErr) {
        console.warn('API Kategori gagal, menggunakan fallback data dari produk');
      }

      const apiProduk = responseProduk.data;
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
        rating: item.rating ?? null
      }));

      setProducts(prosesProduk);

      const listKateg = dataKateg.length > 0 
        ? dataKateg.map(item => typeof item === 'string' ? item : item.kategori_produk)
        : dataProduk.map(item => item.kategori_produk);

      setCategories(['Semua Pakaian', ...new Set(listKateg.filter(Boolean))]);

    } catch (err) {
      console.error('Error API Dashboard:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      setSubmitMessage('Maksimal 4 foto galeri.');
      setGalleryFiles([]);
      e.target.value = '';
      return;
    }
    setGalleryFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const submitData = new FormData();
      submitData.append('nama_produk', formData.nama_produk);
      submitData.append('kategori_produk', formData.kategori_produk);
      submitData.append('harga', formData.harga);
      submitData.append('stok', formData.stok);
      submitData.append('grade_produk', formData.grade_produk);
      submitData.append('deskripsi_produk', formData.deskripsi_produk);
      galleryFiles.forEach(file => submitData.append('galeri', file));

      if (imageFile) {
        submitData.append('gambar_produk', imageFile);
      } else {
        setSubmitMessage('Gambar produk wajib diupload!');
        setIsSubmitting(false);
        return;
      }

      await axios.post(link, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmitMessage('Produk berhasil ditambahkan!');
      
      setFormData({
        nama_produk: '', kategori_produk: '', harga: '', stok: 1, grade_produk: 'Like New (9.5/10)', deskripsi_produk: ''
      });
      setImageFile(null);
      await LoadData();
      setGalleryFiles([]);
    } catch (err) {
      console.error('Error create produk:', err);
      setSubmitMessage(err.response?.data?.message || 'Gagal menambahkan produk');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  const handleEditOpen = async (id) => {
    setActionError('');
    try {
      const response = await axios.get(`${link}/${id}`);
      const product = response.data.data;
      setEditingProduct(product);
      setEditForm({
        nama_produk: product.nama_produk || '',
        kategori_produk: product.kategori_produk || '',
        harga: product.harga || '',
        stok: product.stok ?? 0,
        grade_produk: product.grade_produk || '',
        deskripsi_produk: product.deskripsi_produk || ''
      });
      setEditImageFile(null);
      setEditGalleryFiles([]);
    } catch (requestError) {
      console.error('Gagal memuat detail produk untuk edit:', requestError);
      setActionError(requestError.response?.data?.message || 'Gagal memuat detail produk.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    setActionError('');
    try {
      const submitData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => submitData.append(key, value));
      if (editImageFile) submitData.append('gambar_produk', editImageFile);
      if (editGalleryFiles.length) {
        submitData.append('replace_gallery', 'true');
        editGalleryFiles.forEach(file => submitData.append('galeri', file));
      }
      const response = await axios.put(`${link}/${editingProduct.id_produk}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmitMessage(response.data.message || 'Produk berhasil diperbarui.');
      setEditingProduct(null);
      await LoadData();
    } catch (requestError) {
      console.error('Gagal memperbarui produk:', requestError);
      setActionError(requestError.response?.data?.message || 'Gagal memperbarui produk.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Hapus produk "${product.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setIsDeleting(product.id);
    setActionError('');
    try {
      const response = await axios.delete(`${link}/${product.id}`);
      setSubmitMessage(response.data.message || 'Produk berhasil dihapus.');
      await LoadData();
    } catch (requestError) {
      console.error('Gagal menghapus produk:', requestError);
      setActionError(requestError.response?.data?.message || 'Gagal menghapus produk.');
    } finally {
      setIsDeleting(null);
    }
  };

  // --- LOGIKA FILTERING DATA ---
  const filteredTableProducts = products.filter(item => {
    // 1. Filter Kategori (Mencari kata 'Pria', 'Wanita', 'Sepatu' di dalam string kategori)
    const catLower = (item.category || '').toLowerCase();
    const matchCategory = activeTableCategory === 'Semua' || 
                          (activeTableCategory === 'Pria' && catLower.includes('pria')) ||
                          (activeTableCategory === 'Wanita' && catLower.includes('wanita')) ||
                          (activeTableCategory === 'Sepatu' && catLower.includes('sepatu'));

    // 2. Filter Pencarian Nama / ID
    const term = searchTerm.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(term) || 
                        item.id?.toString().toLowerCase().includes(term) ||
                        `plh-${item.id}`.toLowerCase().includes(term);

    return matchCategory && matchSearch;
  });

  const totalStok = products.reduce((acc, curr) => acc + curr.stock, 0);

  // Daftar Tab Filter
  const tableFilters = ['Semua', 'Pria', 'Wanita', 'Sepatu'];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm text-gray-800">


      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Inventory Audit Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium">
              <button className="px-3 py-1 rounded-md">Customer</button>
              <button className="px-3 py-1 bg-white shadow-sm rounded-md">Admin</button>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">🔔</button>
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              <img src="https://i.pravatar.cc/100" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-xs text-gray-500 flex gap-2">
                <span>Toko Utama</span> &gt; <span className="font-medium text-gray-800">Manajemen Inventaris & Transaksi</span>
              </div>
              <h2 className="text-2xl font-bold mt-1">Pusat Kurasi Produk & Pesanan</h2>
            </div>
          </div>
          {actionError && <div role="alert" className="p-3 rounded-lg bg-red-100 text-red-800 text-sm">{actionError}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="bg-green-50 p-2 rounded-lg text-green-600">💵</div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Total Pendapatan</p>
              <h3 className="text-xl font-bold mt-1">Rp 24.850.000</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">🛍️</div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Pesanan Baru</p>
              <h3 className="text-xl font-bold mt-1">18 <span className="text-sm font-normal text-gray-500">Transaksi</span></h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-600">📦</div>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Siap Jual
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-4">Total Stok Produk</p>
              <h3 className="text-xl font-bold mt-1">{totalStok} <span className="text-sm font-normal text-gray-500">Pcs</span></h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex justify-between items-start">
                <div className="bg-orange-50 p-2 rounded-lg text-orange-500">⭐</div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Total Produk</p>
              <h3 className="text-xl font-bold mt-1">{products.length} <span className="text-sm font-normal text-gray-500">Item</span></h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <span>🧥</span> Tambah Produk Preloved Baru
              </h3>
              
              {submitMessage && (
                <div className={`p-3 mb-4 rounded-lg text-sm ${submitMessage.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitMessage}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                <div className="text-gray-400 mb-2">📸</div>
                <label className="block font-medium text-gray-700 cursor-pointer">
                  Pilih Foto Produk
                  <input key={imageFile ? imageFile.name : 'main-image-empty'} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {imageFile ? `Terpilih: ${imageFile.name}` : 'Format didukung: JPG, PNG. Maksimal 5MB.'}
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Foto Galeri (Opsional, maksimal 4)</label>
                <input key={galleryFiles.map(file => file.name).join('|') || 'gallery-empty'} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryChange} className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-green-800" />
                <p className="text-xs text-gray-500 mt-1">{galleryFiles.length ? `${galleryFiles.length} foto dipilih` : 'Tambahkan foto detail, label, atau kondisi produk.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Produk Preloved</label>
                  <input required name="nama_produk" value={formData.nama_produk} onChange={handleInputChange} type="text" maxLength="150" placeholder="Contoh: Jaket Denim Levi's" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kategori Kurasi</label>
                  <select required name="kategori_produk" value={formData.kategori_produk} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50">
                    <option value="">Pilih Kategori</option>
                    {categories.filter(c => c !== 'Semua Pakaian').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Harga Satuan (Rp)</label>
                  <input required name="harga" value={formData.harga} onChange={handleInputChange} type="number" min="1" step="0.01" placeholder="Rp 0" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah Stok (Pcs)</label>
                    <input required name="stok" value={formData.stok} onChange={handleInputChange} type="number" min="0" max="2147483647" step="1" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Grade Kondisi</label>
                    <select required name="grade_produk" value={formData.grade_produk} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50">
                      <option value="Like New (9.5/10)">Like New (9.5/10)</option>
                      <option value="VGC (8.5/10)">VGC (8.5/10)</option>
                      <option value="Good (7/10)">Good (7/10)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi & Catatan</label>
                <textarea required name="deskripsi_produk" value={formData.deskripsi_produk} onChange={handleInputChange} rows="3" placeholder="Jelaskan ukuran detail, kelengkapan, dll..." className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50"></textarea>
              </div>

              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={isSubmitting} className={`px-6 py-2 text-white rounded-lg text-sm font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-900'}`}>
                  {isSubmitting ? 'Menyimpan...' : '+ Simpan & Publikasikan Produk'}
                </button>
              </div>
            </form>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📝</span> Tips Kurasi Cepat
              </h4>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex gap-2 items-start"><span className="text-green-500">✓</span> Sertakan foto wash tag untuk pakaian branded.</li>
                <li className="flex gap-2 items-start"><span className="text-green-500">✓</span> Ukur ulang manual karena ukuran vintage berbeda.</li>
                <li className="flex gap-2 items-start"><span className="text-green-500">✓</span> Jujur pada noda mikro atau pudar warna.</li>
              </ul>
            </div>
          </div>

          {/* INVENTORY TABLE WITH SEARCH & FILTER */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                    <span className="text-green-800">📋</span> Manajemen Inventaris Produk
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Daftar item preloved aktif yang siap dikirim kepada pembeli</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search Bar Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari nama atau ID..." 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-gray-50 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 w-full sm:w-64" 
                    />
                  </div>
                  
                  {/* Category Filter Pills (Button) */}
                  <div className="flex bg-gray-100 rounded-full p-1 text-sm font-medium text-gray-600">
                    {tableFilters.map((filterName) => (
                      <button 
                        key={filterName}
                        onClick={() => setActiveTableCategory(filterName)}
                        className={`px-4 py-1.5 rounded-full transition-colors ${
                          activeTableCategory === filterName 
                            ? 'bg-white shadow-sm text-gray-800' 
                            : 'hover:bg-gray-200 text-gray-500'
                        }`}
                      >
                        {filterName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Memuat data produk...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : (
                <table className="w-full text-left text-sm min-w-[800px]">
                  <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-y border-gray-200 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Foto</th>
                      <th className="px-6 py-4">Nama Produk</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4 text-center">Stok</th>
                      <th className="px-6 py-4">Harga</th>
                      <th className="px-6 py-4">Kondisi</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTableProducts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-10 text-gray-500">
                          {searchTerm ? 'Pencarian tidak ditemukan.' : 'Belum ada produk.'}
                        </td>
                      </tr>
                    ) : (
                      filteredTableProducts.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                          <td className="px-6 py-2 text-sm text-blue-400 font-medium whitespace-nowrap">
                            PLH-{item.id}
                          </td>
                          <td className="px-6 py-2">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                               <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="px-6 py-2 min-w-[200px]">
                            <p className="font-bold text-gray-800 text-base">{item.title}</p>
                            <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">{item.desc}</p>
                          </td>
                          <td className="px-6 py-2">
                            <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-2 font-bold text-center text-gray-800 whitespace-nowrap">
                            {item.stock} Pcs
                          </td>
                          <td className="px-6 py-2 font-bold text-gray-800 whitespace-nowrap">
                            Rp {item.price.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${
                              item.tag?.includes('Like New') 
                                ? 'text-green-700 bg-green-50 border-green-200' 
                                : 'text-blue-700 bg-blue-50 border-blue-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.tag?.includes('Like New') ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                              {item.tag || 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-3 text-gray-500">
                              <button type="button" onClick={() => handleEditOpen(item.id)} className="hover:text-blue-600 transition-colors" title="Edit" aria-label={`Edit ${item.title}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                              <button type="button" disabled={isDeleting === item.id} onClick={() => handleDelete(item)} className="hover:text-red-600 transition-colors disabled:opacity-50" title="Hapus" aria-label={`Hapus ${item.title}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-500 font-medium">
                Menampilkan {filteredTableProducts.length} dari {products.length} item aktif
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-green-800 text-white text-sm font-medium shadow-sm">1</button>
                <button className="p-1 text-gray-600 hover:text-gray-800">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>

          {editingProduct && editForm && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-product-title">
              <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-green-700 font-semibold">Kelola inventaris</p>
                    <h3 id="edit-product-title" className="text-xl font-bold text-gray-900">Edit produk</h3>
                  </div>
                  <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-gray-800" aria-label="Tutup">✕</button>
                </div>
                {actionError && <div role="alert" className="p-3 rounded-lg bg-red-100 text-red-800 text-sm">{actionError}</div>}
                <div className="flex items-center gap-4">
                  <img src={GetImage(editingProduct.gambar_produk)} alt={editingProduct.nama_produk} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                  <label className="text-sm font-medium text-gray-700">
                    Foto utama (opsional)
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setEditImageFile(event.target.files?.[0] || null)} className="block mt-1 text-sm" />
                    {editImageFile && <span className="block text-xs text-gray-500 mt-1">{editImageFile.name}</span>}
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-sm font-medium text-gray-700">Nama produk
                    <input required value={editForm.nama_produk} onChange={event => setEditForm(previous => ({ ...previous, nama_produk: event.target.value }))} maxLength="150" className="w-full mt-1 border border-gray-300 rounded-lg p-2" />
                  </label>
                  <label className="text-sm font-medium text-gray-700">Kategori
                    <select required value={editForm.kategori_produk} onChange={event => setEditForm(previous => ({ ...previous, kategori_produk: event.target.value }))} className="w-full mt-1 border border-gray-300 rounded-lg p-2 bg-white">
                      {!categories.includes(editForm.kategori_produk) && <option value={editForm.kategori_produk}>{editForm.kategori_produk}</option>}
                      {categories.filter(category => category !== 'Semua Pakaian').map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-gray-700">Harga (Rp)
                    <input required type="number" min="1" max="9999999999.99" step="0.01" value={editForm.harga} onChange={event => setEditForm(previous => ({ ...previous, harga: event.target.value }))} className="w-full mt-1 border border-gray-300 rounded-lg p-2" />
                  </label>
                  <label className="text-sm font-medium text-gray-700">Stok (pcs)
                    <input required type="number" min="0" max="2147483647" step="1" value={editForm.stok} onChange={event => setEditForm(previous => ({ ...previous, stok: event.target.value }))} className="w-full mt-1 border border-gray-300 rounded-lg p-2" />
                  </label>
                  <label className="text-sm font-medium text-gray-700">Grade kondisi
                    <select required value={editForm.grade_produk} onChange={event => setEditForm(previous => ({ ...previous, grade_produk: event.target.value }))} className="w-full mt-1 border border-gray-300 rounded-lg p-2 bg-white">
                      {['Like New (9.5/10)', 'VGC (8.5/10)', 'Good (7/10)'].map(grade => <option key={grade} value={grade}>{grade}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-gray-700">Foto galeri (opsional, maksimal 4)
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => {
                      const files = Array.from(event.target.files || []);
                      if (files.length > 4) {
                        setActionError('Maksimal 4 foto galeri.');
                        event.target.value = '';
                        return;
                      }
                      setActionError('');
                      setEditGalleryFiles(files);
                    }} className="w-full mt-1 text-sm" />
                    <span className="block text-xs text-gray-500 mt-1">Foto baru akan mengganti galeri saat ini. {editGalleryFiles.length ? `${editGalleryFiles.length} foto dipilih.` : ''}</span>
                  </label>
                </div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi produk
                  <textarea required value={editForm.deskripsi_produk} onChange={event => setEditForm(previous => ({ ...previous, deskripsi_produk: event.target.value }))} maxLength="3000" rows="4" className="w-full mt-1 border border-gray-300 rounded-lg p-2" />
                </label>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Batal</button>
                  <button type="submit" disabled={isSavingEdit} className="px-5 py-2 rounded-lg text-white bg-green-800 disabled:bg-gray-400">{isSavingEdit ? 'Menyimpan...' : 'Simpan perubahan'}</button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
