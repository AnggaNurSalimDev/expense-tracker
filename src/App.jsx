import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FormTransaksi from './komponen/FormTransaksi';
import DaftarTransaksi from './komponen/DaftarTransaksi';
import './index.css'; 

export default function App() {
  const [transaksi, setTransaksi] = useState(() => {
    const dataLokal = localStorage.getItem('transaksiExpenseTracker');
    return dataLokal ? JSON.parse(dataLokal) : [];
  });
  
  const [filter, setFilter] = useState('semua');
  const [sortir, setSortir] = useState('terbaru');
  const [tema, setTema] = useState('laki');

  const [mataUang, setMataUang] = useState('IDR');
  const [kursData, setKursData] = useState(null);
  const [errorAPI, setErrorAPI] = useState(false);

  useEffect(() => {
    localStorage.setItem('transaksiExpenseTracker', JSON.stringify(transaksi));
  }, [transaksi]);

  useEffect(() => {
    if (tema === 'perempuan') {
      document.body.classList.add('tema-perempuan');
    } else {
      document.body.classList.remove('tema-perempuan');
    }
  }, [tema]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function ambilKurs() {
      try {
        const response = await fetch('/api/get-rate', { signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setKursData(data.conversion_rates); 
        
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error);
          setErrorAPI(true);
        }
      }
    }

    ambilKurs();

    return () => {
      controller.abort();
    };
  }, []);

  const tambahTransaksi = (dataBaru) => {
    setTransaksi([...transaksi, dataBaru]);
  };

  const hapusTransaksi = (id) => {
    setTransaksi(transaksi.filter((t) => t.id !== id));
  };

  const totalMasuk = transaksi
    .filter((t) => t.tipe === 'masuk')
    .reduce((total, item) => total + item.jumlah, 0);

  const totalKeluar = transaksi
    .filter((t) => t.tipe === 'keluar')
    .reduce((total, item) => total + item.jumlah, 0);

  const saldoTotal = totalMasuk - totalKeluar;

  let saldoTerditampilkan = saldoTotal;
  if (mataUang !== 'IDR' && kursData && kursData['IDR']) {
    const nilaiKursTujuan = kursData[mataUang];
    if (nilaiKursTujuan) {
      saldoTerditampilkan = (saldoTotal / kursData['IDR']) * nilaiKursTujuan;
    }
  }

  const dataPengeluaran = transaksi
    .filter((t) => t.tipe === 'keluar')
    .reduce((acc, curr) => {
      const item = acc.find((i) => i.name === (curr.kategori || 'Lainnya'));
      if (item) {
        item.value += curr.jumlah;
      } else {
        acc.push({ name: curr.kategori || 'Lainnya', value: curr.jumlah });
      }
      return acc;
    }, []);

  const WARNA_CHART = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#1dd1a1', '#5f27cd'];

  const transaksiDitampilkan = transaksi
    .filter((t) => {
      if (filter === 'semua') return true;
      return t.tipe === filter;
    })
    .sort((a, b) => {
      const waktuA = a.timestamp || 0;
      const waktuB = b.timestamp || 0;
      if (sortir === 'terbaru') return waktuB - waktuA;
      if (sortir === 'terlama') return waktuA - waktuB;
      if (sortir === 'terbesar') return b.jumlah - a.jumlah;
      if (sortir === 'terkecil') return a.jumlah - b.jumlah;
      return 0;
    });

  return (
    <div className="layout-utama">
      <div className="wadah-aplikasi">

        <div className="header-atas">
          <h2 className="judul-utama">Expense Tracker</h2>
          <button
            className="tombol-tema  "
            onClick={() => setTema(tema === 'laki' ? 'perempuan' : 'laki')}
          >
            Ganti Warna
          </button>
        </div>

        <div className="grid-utama">

          <div className="kolom-kiri">
            <div className="ringkasan">
              <div className="saldo-utama">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>SALDO TOTAL</h4>
                  <select value={mataUang} onChange={(e) => setMataUang(e.target.value)} className="dropdown-kur">
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (Dollar AS)</option>
                    <option value="JPY">JPY (Yen Jepang)</option>
                    <option value="SGD">SGD (Dollar Singapura)</option>
                  </select>
                </div>
                <h2>
                  {mataUang === 'IDR' 
                    ? `Rp ${saldoTerditampilkan.toLocaleString('id-ID')}` 
                    : `${mataUang} ${saldoTerditampilkan.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  }
                </h2>
                {errorAPI && (
                  <span style={{ color: '#ff6b6b', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    ⚠️ Koneksi API Kurs terputus. Hanya mode IDR yang tersedia.
                  </span>
                )}
              </div>

              <div className="detail-arus">
                <div className="arus-kas masuk">
                  <h4>↗ PEMASUKAN</h4>
                  <p>+ Rp {totalMasuk.toLocaleString('id-ID')}</p>
                </div>
                <div className="arus-kas keluar">
                  <h4>↓ PENGELUARAN</h4>
                  <p>- Rp {totalKeluar.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            {dataPengeluaran.length > 0 && (
              <div className="visualisasi-wadah">
                <h4>Proporsi Pengeluaran</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie 
                      data={dataPengeluaran} 
                      cx="50%" cy="50%" 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {dataPengeluaran.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={WARNA_CHART[index % WARNA_CHART.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <FormTransaksi onTambah={tambahTransaksi} kursData={kursData} errorAPI={errorAPI}/>
          </div>

          <div className="kolom-kanan panel-daftar">
            <div className="kontrol-tampilan">
              <div className="wadah-filter">
                <button
                  className={`tombol-filter ${filter === 'semua' ? 'aktif' : ''}`}
                  onClick={() => setFilter('semua')}
                >Semua</button>
                <button
                  className={`tombol-filter ${filter === 'masuk' ? 'aktif' : ''}`}
                  onClick={() => setFilter('masuk')}
                >Masuk</button>
                <button
                  className={`tombol-filter ${filter === 'keluar' ? 'aktif' : ''}`}
                  onClick={() => setFilter('keluar')}
                >Keluar</button>
              </div>

              <select
                className="dropdown-sortir"
                value={sortir}
                onChange={(e) => setSortir(e.target.value)}
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="terbesar">Nominal Terbesar</option>
                <option value="terkecil">Nominal Terkecil</option>
              </select>
            </div>

            <h3>Data Transaksi</h3>
            <DaftarTransaksi daftar={transaksiDitampilkan} onHapus={hapusTransaksi} />
          </div>

        </div>
      </div>
    </div>
  );
}