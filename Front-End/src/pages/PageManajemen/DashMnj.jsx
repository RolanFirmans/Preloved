import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Download, 
  Plus, 
  Bell, 
  TrendingUp, 
  ShoppingBag, 
  Star, 
  UploadCloud, 
  Search, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

const DashMnj = () => {
  const [activeTab, setActiveTab] = useState('stok');

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-gray-800">
      
      {/* SIDEBAR (Kiri) */}
      <aside className="w-64 bg-[#f8f9fa] border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">PreLoved Hub</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('ringkasan')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ringkasan' ? 'bg-[#1e5631] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Ringkasan Toko
          </button>
          <button 
            onClick={() => setActiveTab('stok')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'stok' ? 'bg-[#1e5631] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Package className="w-5 h-5" />
            Stok & Produk
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA (Kanan) */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* HEADER */}
        <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white flex-shrink-0">
          <div>
            <p className="text-xs text-gray-500 mb-1">Toko Utama &gt; <span className="font-semibold">Manajemen Inventaris & Transaksi</span></p>
            <h2 className="text-2xl font-bold text-gray-900">Pusat Kurasi Produk & Pesanan</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              <Download className="w-4 h-4" /> Unduh Rekap CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1e5631] text-white rounded-lg text-sm font-medium hover:bg-green-900 transition">
              <Plus className="w-4 h-4" /> Tambah Preloved Baru
            </button>
            
            <div className="w-px h-8 bg-gray-200 mx-2"></div>
            
            <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-full">
              <span className="px-3 py-1 text-xs text-gray-500 cursor-pointer">Customer</span>
              <span className="px-3 py-1 text-xs bg-white text-gray-800 rounded-full shadow-sm font-semibold cursor-pointer">Admin</span>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <img src="https://ui-avatars.com/api/?name=Admin&background=1e5631&color=fff" alt="Profile" className="w-9 h-9 rounded-full ml-2 cursor-pointer" />
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#fdfdfd]">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<TrendingUp className="text-green-600" />} title="Total Pendapatan" value="Rp 24.850.000" badge="+14%" />
            <StatCard icon={<ShoppingBag className="text-blue-500" />} title="Pesanan Baru" value="18 Transaksi" subtext="5 Perlu verifikasi kirim" subtextColor="text-orange-500" />
            <StatCard icon={<Package className="text-gray-600" />} title="Total Stok Produk" value="142 Pcs" badge="Siap Jual" badgeColor="bg-green-100 text-green-700" />
            <StatCard icon={<Star className="text-yellow-500" />} title="Tingkat Kepuasan Kurasi" value="4.9 / 5.0" subtext="Kualitas Terjamin (312 review)" subtextColor="text-gray-500" />
          </div>

          {/* FORM & TIPS SECTION */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            
            {/* FORM TAMBAH PRODUK */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#1e5631] rounded-full inline-block"></span>
                  Tambah Produk Preloved Baru
                </h3>
                <span className="text-xs text-gray-500">Verifikasi Kurator Standar A</span>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Foto Detail Barang</p>
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 text-center hover:bg-gray-100 transition cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700">Tarik & Letakkan foto pakaian / sepatu di sini</p>
                  <p className="text-xs text-gray-500 mt-1">Format didukung: JPG, PNG, WEBP. Maksimal 5MB per foto.</p>
                  <div className="flex justify-center gap-2 mt-4">
                    {['Tampak Depan', 'Label Brand', 'Detail Jahitan', 'Kondisi Kerah/Sol'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputField label="Nama Produk Preloved" placeholder="Contoh: Jaket Denim Levi's Vintage 90s" />
                <SelectField label="Kategori Kurasi" options={['Pilih Kategori Produk', 'Atasan Pria', 'Atasan Wanita', 'Sepatu']} />
                <InputField label="Harga Satuan (Rp)" placeholder="Rp 0" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Jumlah Stok (Pcs)" placeholder="1" />
                  <SelectField label="Grade Kondisi" options={['Like New (9.5/10)', 'VGC (8.5/10)', 'Good (7/10)']} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Deskripsi & Catatan Kurasi Transparan</label>
                  <span className="text-xs text-gray-400">Transparansi mencegah retur</span>
                </div>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                  placeholder="Jelaskan ukuran presisi (P x L dalam cm), warna asli, kelengkapan tag, dan catatan cacat mikro jika ada..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button className="bg-[#1e5631] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-900 transition flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Simpan & Publikasikan Produk
                </button>
              </div>
            </div>

            {/* TIPS KURASI */}
            <div className="w-full lg:w-72 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Tips Kurasi Cepat
              </h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-2 items-start"><span className="text-green-500 mt-0.5">✓</span> Sertakan foto wash tag untuk pakaian branded guna memverifikasi keaslian.</li>
                <li className="flex gap-2 items-start"><span className="text-green-500 mt-0.5">✓</span> Ukur ulang manual (Panjang x Lebar) karena ukuran vintage berbeda dengan standar modern.</li>
                <li className="flex gap-2 items-start"><span className="text-green-500 mt-0.5">✓</span> Jujur pada noda mikro atau pudar warna untuk mempertahankan rating 4.9.</li>
              </ul>
            </div>
          </div>

          {/* TABEL INVENTARIS */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" /> Manajemen Inventaris Produk
                </h3>
                <p className="text-xs text-gray-500 mt-1">Daftar item preloved aktif yang siap dikirim kepada pembeli</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input type="text" placeholder="Cari nama atau ID..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none w-64" />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {['Semua', 'Pria', 'Wanita', 'Sepatu'].map(filter => (
                    <button key={filter} className={`px-3 py-1 text-xs rounded-md ${filter === 'Semua' ? 'bg-white font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Foto</th>
                    <th className="px-4 py-3 w-1/3">Nama Produk</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Stok</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3">Kondisi</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <InventoryRow id="PLR-8821" img="👟" name="Nike Air Jordan 1 High Retro OG" desc="Size 42.5 EU / Box Pengganti" category="Sepatu" stock="1 Pcs" price="Rp 1.850.000" condition="Like New (9/10)" badgeColor="bg-green-100 text-green-700" />
                  <InventoryRow id="PLR-7643" img="👕" name="Kemeja Flanel Uniqlo Tartan Series" desc="Size L Pria / Warna Merah Navy" category="Atasan Pria" stock="3 Pcs" price="Rp 145.000" condition="VGC (8.5/10)" badgeColor="bg-blue-100 text-blue-700" />
                  <InventoryRow id="PLR-6499" img="👖" name="Celana Panjang Dickies 874 Original" desc="Size 32 Khaki / Made in Mexico" category="Bawahan Pria" stock="2 Pcs" price="Rp 280.000" condition="VGC (8.5/10)" badgeColor="bg-blue-100 text-blue-700" />
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <p>Menampilkan 3 dari 142 item aktif</p>
              <div className="flex gap-1">
                <button className="px-2 py-1 border rounded hover:bg-gray-50">&lt;</button>
                <button className="px-2 py-1 border bg-[#1e5631] text-white rounded">1</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-50">2</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-50">3</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-50">&gt;</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* --- KOMPONEN KECIL PENDUKUNG --- */

const StatCard = ({ icon, title, value, badge, badgeColor, subtext, subtextColor }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
      {badge && <span className={`text-xs px-2 py-1 rounded-md font-semibold ${badgeColor || 'bg-green-100 text-green-700'}`}>{badge}</span>}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
      {subtext && <p className={`text-xs mt-2 font-medium ${subtextColor}`}>{subtext}</p>}
    </div>
  </div>
);

const InputField = ({ label, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input type="text" placeholder={placeholder} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
  </div>
);

const SelectField = ({ label, options }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <select className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
      {options.map((opt, i) => <option key={i}>{opt}</option>)}
    </select>
  </div>
);

const InventoryRow = ({ id, img, name, desc, category, stock, price, condition, badgeColor }) => (
  <tr className="hover:bg-gray-50 transition">
    <td className="px-4 py-4 text-gray-500">{id}</td>
    <td className="px-4 py-4"><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">{img}</div></td>
    <td className="px-4 py-4">
      <p className="font-bold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </td>
    <td className="px-4 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{category}</span></td>
    <td className="px-4 py-4 font-medium">{stock}</td>
    <td className="px-4 py-4 font-bold">{price}</td>
    <td className="px-4 py-4">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>● {condition}</span>
    </td>
    <td className="px-4 py-4 text-right">
      <div className="flex justify-end gap-2 text-gray-400">
        <button className="hover:text-gray-800"><Edit3 className="w-4 h-4" /></button>
        <button className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
      </div>
    </td>
  </tr>
);

export default DashMnj;