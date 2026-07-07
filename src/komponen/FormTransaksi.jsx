import { useState, useEffect } from 'react';

export default function FormTransaksi({ onTambah }) {
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tipe, setTipe] = useState('masuk');
  const [kategori, setKategori] = useState('Gaji');

  const kategoriMasuk = ['Gaji', 'Bonus', 'Investasi', 'Lainnya'];
  const kategoriKeluar = ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Belanja', 'Lainnya'];

  useEffect(() => {
    setKategori(tipe === 'masuk' ? kategoriMasuk[0] : kategoriKeluar[0]);
  }, [tipe]);

  const tanganiSubmit = (e) => {
    e.preventDefault();
    if (!nama || !jumlah) return;

    onTambah({
      id: crypto.randomUUID(),
      nama,
      jumlah: parseFloat(jumlah),
      tipe,
      kategori,
      timestamp: Date.now()
    });

    setNama('');
    setJumlah('');
    setTipe('masuk');
  };

  return (
    <form onSubmit={tanganiSubmit} className="form-transaksi">
      <div className="grup-input">
        <label>Nama Transaksi:</label>
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      
      <div className="grup-input">
        <label>Jumlah:</label>
        <input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} required />
      </div>
      
      <div className="grup-input-sejajar">
        <div className="grup-input" style={{ flex: 1 }}>
          <label>Tipe:</label>
          <select value={tipe} onChange={(e) => setTipe(e.target.value)}>
            <option value="masuk">Masuk</option>
            <option value="keluar">Keluar</option>
          </select>
        </div>

        <div className="grup-input" style={{ flex: 1 }}>
          <label>Kategori:</label>
          <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
            {(tipe === 'masuk' ? kategoriMasuk : kategoriKeluar).map(kat => (
              <option key={kat} value={kat}>{kat}</option>
            ))}
          </select>
        </div>
      </div>
      
      <button type="submit" className="tombol-submit">Tambah Transaksi</button>
    </form>
  );
}