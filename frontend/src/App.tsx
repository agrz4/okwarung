import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Products from "./components/ManageProduct";
import Transactions from "./components/ManageTransaction";

// URL dasar untuk API backend
const API_URL = 'http://localhost:5000/api';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [view, setView] = useState<string>('dashboard');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [products, setProducts] = useState<any[]>([]); // Ganti 'any[]' dengan tipe data yang sesuai
  const [transactions, setTransactions] = useState<any[]>([]); // Ganti 'any[]' dengan tipe data yang sesuai

  // --- API Functions ---
  const handleLogin = async (credentials: any) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Gagal terhubung ke server.');
    }
  };

  const fetchProducts = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        console.error('Gagal mengambil data produk: ' + data.message);
      }
    } catch (error) {
      console.error('Gagal terhubung ke server.');
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions(data);
      } else {
        console.error('Gagal mengambil data transaksi: ' + data.message);
      }
    } catch (error) {
      console.error('Gagal terhubung ke server.');
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchProducts();
      fetchTransactions();
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="bg-gray-800 text-white w-64 p-6 flex flex-col min-h-screen">
        <h1 className="text-xl font-bold mb-8">Sistem Penjualan</h1>
        <nav className="flex-1 space-y-2">
          <button className={`py-2 px-3 rounded-lg w-full text-left ${view === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`} onClick={() => setView('dashboard')}>Dashboard</button>
          <button className={`py-2 px-3 rounded-lg w-full text-left ${view === 'products' ? 'bg-gray-700' : 'hover:bg-gray-700'}`} onClick={() => setView('products')}>Produk</button>
          <button className={`py-2 px-3 rounded-lg w-full text-left ${view === 'transactions' ? 'bg-gray-700' : 'hover:bg-gray-700'}`} onClick={() => setView('transactions')}>Transaksi</button>
        </nav>
        <button className="w-full mt-auto py-2 px-3 text-left hover:bg-gray-700 rounded-lg" onClick={() => {
          localStorage.removeItem('token');
          setToken(null);
        }}>
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8">
        {view === 'dashboard' && <Dashboard token={token} apiUrl={API_URL} />}
        {view === 'products' && <Products token={token} apiUrl={API_URL} products={products} fetchProducts={fetchProducts} />}
        {view === 'transactions' && <Transactions token={token} apiUrl={API_URL} products={products} transactions={transactions} fetchTransactions={fetchTransactions} />}
      </main>
    </div>
  );
};

export default App;