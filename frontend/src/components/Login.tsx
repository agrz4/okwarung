import { useState } from "react";

interface LoginProps {
    onLogin: (credentials: any) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('admin');
    const [password, setPassword] = useState<string>('admin');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit =  async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onLogin({ username, password });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">Login</button>
          {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
