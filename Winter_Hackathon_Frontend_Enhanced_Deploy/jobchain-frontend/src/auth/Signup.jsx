import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authApi.signup({ username, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Register</h1>
        </div>

        {/* Transparent Card */}
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-2xl shadow-purple-500/10 border border-white/40 overflow-hidden">
          <div className="p-8">
            {success ? (
              // Success Message
              <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-400/30 mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Account Created!</h3>
                <p className="text-gray-600">Redirecting to login page...</p>
              </div>
            ) : (
              // Signup Form
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Input */}
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
                      className="w-full pl-4 pr-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/60 focus:bg-white/70 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all placeholder:text-gray-500"
                      placeholder="Choose a username"
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
                      className="w-full pl-4 pr-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/60 focus:bg-white/70 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all placeholder:text-gray-500"
                      placeholder="Create a password (min 6 characters)"
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-800">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-4 pr-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/60 focus:bg-white/70 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all placeholder:text-gray-500"
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/30 backdrop-blur-sm">
                    <p className="text-sm text-red-700 text-center">{error}</p>
                  </div>
                )}

                {/* Create Account Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Login Link */}
                <div className="pt-4 text-center border-t border-white/30">
                  <p className="text-sm text-gray-700">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-semibold text-purple-600 hover:text-purple-800 transition-colors underline-offset-2 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-1">© 2024 Your App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}