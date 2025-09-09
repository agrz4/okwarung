import { useEffect, useState } from "react";

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

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction: Transaction | null;
  products: Product[];
  token: string | null;
  apiUrl: string;
  fetchTransactions: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, editingTransaction, products, token, apiUrl, fetchTransactions }) => {
  const [date, setDate] = useState<string>(editingTransaction?.transaction_date || new Date().toISOString().split('T')[0]);
  const [productId, setProductId] = useState<number>(editingTransaction?.product_id || (products.length > 0 ? products[0].id : 0));
  const [quantity, setQuantity] = useState<number>(editingTransaction?.quantity || 1);
  const [price, setPrice] = useState<number>(editingTransaction?.price || (products.find(p => p.id === productId)?.price || 0));
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (editingTransaction) {
      setDate(editingTransaction.transaction_date);
      setProductId(editingTransaction.product_id);
      setQuantity(editingTransaction.quantity);
      setPrice(editingTransaction.price);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setProductId(products.length > 0 ? products[0].id : 0);
      setQuantity(1);
      setPrice(products.length > 0 ? products[0].price : 0);
    }
  }, [editingTransaction, products]);

  useEffect(() => {
    setTotal(quantity * price);
  }, [quantity, price]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProductId = parseInt(e.target.value);
    setProductId(newProductId);
    const selectedProduct = products.find(p => p.id === newProductId);
    if (selectedProduct) {
      setPrice(selectedProduct.price);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = {
      transaction_date: date,
      product_id: productId,
      quantity,
      price,
      total,
    };

    try {
      if (editingTransaction) {
        await fetch(`${apiUrl}/transactions/${editingTransaction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(transactionData),
        });
      } else {
        await fetch(`${apiUrl}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(transactionData),
        });
      }
      onClose();
      fetchTransactions();
    } catch (error) {
      alert('Gagal menyimpan transaksi.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">{editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="transaction-date" className="block text-sm font-medium text-gray-700">Tanggal</label>
            <input type="date" id="transaction-date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="transaction-product-id" className="block text-sm font-medium text-gray-700">Produk</label>
            <select id="transaction-product-id" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={productId} onChange={handleProductChange} required>
              {products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="transaction-quantity" className="block text-sm font-medium text-gray-700">Jumlah Terjual</label>
            <input type="number" id="transaction-quantity" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} required />
          </div>
          <div>
            <label htmlFor="transaction-price" className="block text-sm font-medium text-gray-700">Harga per Unit</label>
            <input type="number" id="transaction-price" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} required />
          </div>
          <div>
            <label htmlFor="transaction-total" className="block text-sm font-medium text-gray-700">Total (Otomatis)</label>
            <input type="number" id="transaction-total" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100" value={total} readOnly />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300" onClick={onClose}>Batal</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;