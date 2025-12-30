import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { authApi } from '../api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.login({ username: username, password });
      const token = response.data.token;
      const role = login(token);

      if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'STUDENT' || role === 'ROLE_STUDENT') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/merit');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">login</h1>
        </div>

        {/* Transparent Card */}
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-2xl shadow-blue-500/10 border border-white/40 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-800">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-4 pr-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/60 focus:bg-white/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all placeholder:text-gray-500"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-4 pr-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/60 focus:bg-white/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all placeholder:text-gray-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Remember Me*/}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                    className="h-4 w-4 rounded border-white/60 bg-white/50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-700">
                    Remember Me
                  </Label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/30 backdrop-blur-sm">
                  <p className="text-sm text-red-700 text-center">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'login'
                )}
              </Button>

              {/* Register Link */}
              <div className="pt-4 text-center border-t border-white/30">
                <p className="text-sm text-gray-700">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors underline-offset-2 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2024 Your App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}