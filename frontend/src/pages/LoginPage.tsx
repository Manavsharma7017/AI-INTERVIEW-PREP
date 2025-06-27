import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { Brain, Users, User, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoginForm } from '../components/forms/Loginform';
import { authState } from '../store/auth';
import { authService } from '../services/auth';
import { saveAuthData, getUserRole } from '../utils/auth';
import type { LoginRequest } from '../types/types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest) => {
    try {
      setIsLoading(true);

      const response = isAdmin
        ? await authService.loginAdmin(data)
        : await authService.loginUser(data);

      const { token, user } = response;
      const role = getUserRole(user);

      saveAuthData(token, user);
      setAuth({
        user,
        token,
        isAuthenticated: true,
        role,
      });

      toast.success(`Welcome ${user.name || ''}!`);
      navigate('/app/About');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 ">
      <div className="w-full max-w-md space-y-8">
        {/* Back link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Logo + heading */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Interview Prep
          </h1>
          <p className="text-sm text-gray-600">
            Welcome back! Sign in to continue your journey.
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex flex-wrap justify-center">
          <Link
            to="/login"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              !isAdmin
                ? 'bg-blue-100 text-blue-700 shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="h-4 w-4" />
            <span>User Login</span>
          </Link>
          <Link
            to="/login?admin=true"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              isAdmin
                ? 'bg-purple-100 text-purple-700 shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={(e) => isLoading && e.preventDefault()}
          >
            <Users className="h-4 w-4" />
            <span>Admin Login</span>
          </Link>
        </div>

        {/* Login form */}
        <Card className="shadow-xlbg-white/80 backdrop-blur-md">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            title={isAdmin ? 'Admin Sign In' : 'User Sign In'}
            isAdmin={isAdmin}
          />

          {/* Sign-up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to={`/register${isAdmin ? '?admin=true' : ''}`}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
