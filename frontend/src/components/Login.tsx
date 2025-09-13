import { useState } from "react";
import { GiWaterGallon, GiGasStove } from 'react-icons/gi';

interface LoginProps {
    onLogin: (credentials: any) => Promise<void>;
}

// Gallon Logo Component
const GallonLogo = () => (
  <div className="flex items-center justify-center mb-6">
    <div className="flex items-center space-x-6">
      {/* Water/Gallon Icon */}
      <div className="flex flex-col items-center">
        <GiWaterGallon className="text-6xl text-blue-500 drop-shadow-lg" />
        {/* <span className="text-xs text-gray-600 mt-1">Galon</span> */}
      </div>
      
      {/* Gas Icon */}
      <div className="flex flex-col items-center">
        <GiGasStove className="text-6xl text-green-500 drop-shadow-lg" />
        {/* <span className="text-xs text-gray-600 mt-1">Gas</span> */}
      </div>
    </div>
  </div>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('admin');
    const [password, setPassword] = useState<string>('admin');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onLogin({ username, password });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4">

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-blue-100">
                <GallonLogo />
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">AquaGas Store</h1>
                    <h2 className="text-lg font-semibold text-blue-600 mb-1">Admin Login</h2>
                    <p className="text-sm text-gray-500">Sistem Manajemen Toko Galon & Gas</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                            Username
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                id="username" 
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="Masukkan username"
                                required 
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input 
                                type="password" 
                                id="password" 
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Masukkan password"
                                required 
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span>Masuk Sistem</span>
                        </span>
                    </button>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-700 text-sm font-medium">{error}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Air Galon</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Gas LPG</span>
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">© 2025 AquaGas Store Management System</p>
                </div>
            </div>
        </div>
    );
};

export default Login;