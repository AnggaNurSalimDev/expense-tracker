import ItemTransaksi from './ItemTransaksi';

export default function DaftarTransaksi({ daftar, onHapus }) {
  if (daftar.length === 0) {
    return <p style={{ textAlign: 'center', color: '#888' }}>Belum ada transaksi dicatat.</p>;
  }

  return (
    <ul className="daftar-transaksi">
      {daftar.map((item) => (
        <ItemTransaksi key={item.id} item={item} onHapus={onHapus} />
      ))}
    </ul>
  );
}