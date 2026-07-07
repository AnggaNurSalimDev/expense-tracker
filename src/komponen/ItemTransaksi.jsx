export default function ItemTransaksi({ item, onHapus }) {
  return (
    <li className={`item-transaksi ${item.tipe}`}>
      <div className="info-item-baru">
        <div className="teks-item">
          <span className="nama-item">{item.nama}</span>
          <span className="kategori-badge">{item.kategori || 'Lainnya'}</span>
        </div>
        <span className="jumlah-item">
          {item.tipe === 'masuk' ? '+' : '-'} Rp {item.jumlah.toLocaleString('id-ID')}
        </span>
      </div>
      <button onClick={() => onHapus(item.id)} className="tombol-hapus">
        X
      </button>
    </li>
  );
}