import { useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import ProductModal from './ModalProduct'

interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductsProps {
    token: string | null;
    apiUrl: string;
    products: Product[];
    fetchProducts: () => void;
}

const Products: React.FC<ProductsProps> = ({ token, apiUrl, products, fetchProducts }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus produk?')) {
            try {
                await fetch(`${apiUrl}/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                fetchProducts();
            } catch {
                alert('Gagal menghapus produk.');
            }
        }
};

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

     return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manajemen Produk</h2>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700" onClick={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}>Tambah Produk</button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <table className="min-w-full text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nama Produk</th>
              <th className="px-6 py-3">Harga (Rp)</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="bg-white border-b hover:bg-gray-100">
                <td className="px-6 py-3">{product.name}</td>
                <td className="px-6 py-3">{formatCurrency(product.price)}</td>
                <td className="px-6 py-3 space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 inline-flex items-center" onClick={() => handleEdit(product)} aria-label="Edit">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800 inline-flex items-center" onClick={() => handleDelete(product.id)} aria-label="Hapus">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        token={token}
        apiUrl={apiUrl}
        fetchProducts={fetchProducts}
      />
    </div>
  );
};

export default Products;