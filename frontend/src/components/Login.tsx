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
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onLogin({ username, password });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Flowing background shapes */}
            
            <div className="flex w-full max-w-6xl mx-auto relative z-10">
                {/* Left side - Welcome message */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold mb-4">Hello!</h1>
                        <p className="text-xl opacity-90">Sign in to your account</p>
                    </div>
                    
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                        <p className="text-lg opacity-80 leading-relaxed">
                            Kelola sistem manajemen toko galon dan gas LPG Anda dengan mudah. 
                            Pantau inventori, kelola pesanan, dan tingkatkan efisiensi bisnis Anda.
                        </p>
                    </div>

                    <GallonLogo />
                </div>

                {/* Right side - Login form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        {/* Mobile header */}
                        <div className="lg:hidden text-center mb-8 text-white">
                            <h1 className="text-3xl font-bold mb-2">AquaGas Store</h1>
                            <p className="text-lg opacity-90">Admin Login</p>
                        </div>

                        {/* Login card */}
                        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                            {/* Icons for desktop */}
                            <div className="hidden lg:flex items-center justify-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <GiWaterGallon className="text-5xl text-blue-500 drop-shadow-lg" />
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-2xl">
                                        <GiGasStove className="text-5xl text-green-500 drop-shadow-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
                                <p className="text-gray-600">Enter your credentials to access the system</p>
                            </div>

                            <div className="space-y-6">
                                {/* Username field */}
                                <div className="space-y-2">
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="username" 
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400" 
                                            value={username} 
                                            onChange={(e) => setUsername(e.target.value)} 
                                            placeholder="Enter your username"
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Password field */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            id="password" 
                                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            placeholder="Enter your password"
                                            required 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-blue-500 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember me and forgot password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                        <span className="text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Submit button */}
                                <button 
                                    type="submit" 
                                    onClick={handleSubmit}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:from-blue-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    <span className="flex items-center justify-center space-x-2">
                                        <span>SIGN IN</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </span>
                                </button>

                                {/* Error message */}
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-red-700 text-sm font-medium">{error}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Create account link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">
                                        Create one
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center text-white/80">
                            <p className="text-sm">© 2025 AquaGas Store Management System</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;