import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingProduct: Product | null;
    token: string | null;
    apiUrl: string;
    fetchProducts: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, editingProduct, token, apiUrl, fetchProducts }) => {
  const [name, setName] = useState<string>(editingProduct?.name || '');
  const [price, setPrice] = useState<number>(editingProduct?.price || 0);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price);
    } else {
      setName('');
      setPrice(0);
    }
  }, [editingProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { name, price };

    try {
      if (editingProduct) {
        await fetch(`${apiUrl}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(productData),
        });
      } else {
        await fetch(`${apiUrl}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(productData),
        });
      }
      onClose();
      fetchProducts();
    } catch (error) {
      alert('Gagal menyimpan produk.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input type="text" id="product-name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Harga per Unit</label>
            <input type="number" id="product-price" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
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

export default ProductModal;