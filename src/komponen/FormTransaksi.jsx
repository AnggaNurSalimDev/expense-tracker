import { useState, useEffect } from 'react';

export default function FormTransaksi({ onTambah, kursData, errorAPI }) {
  const [nama, setNama] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tipe, setTipe] = useState('masuk');
  const [kategori, setKategori] = useState('Gaji');
  const [mataUangInput, setMataUangInput] = useState('IDR');

  const kategoriMasuk = ['Gaji', 'Bonus', 'Investasi', 'Lainnya'];
  const kategoriKeluar = ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Belanja', 'Lainnya'];

  useEffect(() => {
    setKategori(tipe === 'masuk' ? kategoriMasuk[0] : kategoriKeluar[0]);
  }, [tipe]);

  const tanganiSubmit = (e) => {
    e.preventDefault();
    if (!nama || !jumlah) return;

    let jumlahFinal = parseFloat(jumlah);

    if (mataUangInput !== 'IDR' && kursData && kursData['IDR']) {
      const kursInput = kursData[mataUangInput];
      if (kursInput) {
        jumlahFinal = (jumlahFinal / kursInput) * kursData['IDR'];
      }
    }

    const namaDisimpan = mataUangInput !== 'IDR' 
      ? `${nama} (${jumlah} ${mataUangInput})` 
      : nama;

    onTambah({
      id: crypto.randomUUID(),
      nama: namaDisimpan,
      jumlah: jumlahFinal,
      tipe,
      kategori,
      timestamp: Date.now()
    });

    setNama('');
    setJumlah('');
    setTipe('masuk');
    setMataUangInput('IDR');
  };

  return (
    <form onSubmit={tanganiSubmit} className="form-transaksi">
      <div className="grup-input">
        <label>Nama Transaksi:</label>
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      
      <div className="grup-input-sejajar" style={{ display: 'flex', gap: '10px' }}>
        <div className="grup-input" style={{ flex: 2 }}>
          <label>Jumlah:</label>
          <input type="number" step="any" value={jumlah} onChange={(e) => setJumlah(e.target.value)} required />
        </div>
        
        <div className="grup-input" style={{ flex: 1 }}>
          <label>Mata Uang:</label>
          <select value={mataUangInput} 
          onChange={(e) => setMataUangInput(e.target.value)}
          disabled={errorAPI}>
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
            <option value="JPY">JPY</option>
            <option value="SGD">SGD</option>
          </select>
        </div>
      </div>
      
      <div className="grup-input-sejajar" style={{ display: 'flex', gap: '10px' }}>
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
      
      <button type="submit" className="tombol-submit" style={{ marginTop: '15px' }}>
        Tambah Transaksi
        </button>
    </form>
  );
}