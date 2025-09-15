import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TransactionModal from './ModalTransaction'

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Transaction {
  id: number;
  transaction_date: string;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  productName: string;
}

interface TransactionsProps {
  token: string | null;
  apiUrl: string;
  products: Product[];
  transactions: Transaction[];
  fetchTransactions: () => void;
}

const Transactions: React.FC<TransactionsProps> = ({ token, apiUrl, products, transactions, fetchTransactions }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportExcel = () => {
    const data = transactions.map(t => ({
      'ID Transaksi': t.id,
      'Tanggal': t.transaction_date,
      'Nama Produk': t.productName,
      'Jumlah Terjual': t.quantity,
      'Harga per Unit': t.price,
      'Total Omset': t.total,
    }));
    const ws = (window as any).XLSX.utils.json_to_sheet(data);
    const wb = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");
    (window as any).XLSX.writeFile(wb, "laporan_penjualan.xlsx");
  };

  const handleExportPDF = () => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    const tableData = transactions.map(t => [
      t.id,
      t.transaction_date,
      t.productName,
      t.quantity,
      formatCurrency(t.price),
      formatCurrency(t.total),
    ]);
    doc.autoTable({
      head: [['ID', 'Tanggal', 'Produk', 'Jumlah', 'Harga/Unit', 'Total']],
      body: tableData,
    });
    doc.save("laporan_penjualan.pdf");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await fetch(`${apiUrl}/transactions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        fetchTransactions();
      } catch (error) {
        alert('Gagal menghapus transaksi.');
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Daftar Transaksi</h2>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700" onClick={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}>Tambah Transaksi</button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300" onClick={handleExportExcel}>Export Excel</button>
        <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300" onClick={handleExportPDF}>Export PDF</button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <table className="min-w-full text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3">Produk</th>
              <th className="px-6 py-3">Jumlah</th>
              <th className="px-6 py-3">Harga/Unit</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} className="bg-white border-b hover:bg-gray-100">
                <td className="px-6 py-3">{transaction.id}</td>
                <td className="px-6 py-3">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td className="px-6 py-3">{transaction.productName}</td>
                <td className="px-6 py-3">{transaction.quantity}</td>
                <td className="px-6 py-3">{formatCurrency(transaction.price)}</td>
                <td className="px-6 py-3">{formatCurrency(transaction.total)}</td>
                <td className="px-6 py-3 space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 inline-flex items-center" onClick={() => handleEdit(transaction)} aria-label="Edit">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800 inline-flex items-center" onClick={() => handleDelete(transaction.id)} aria-label="Hapus">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTransaction={editingTransaction}
        products={products}
        token={token}
        apiUrl={apiUrl}
        fetchTransactions={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;