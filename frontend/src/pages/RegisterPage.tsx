import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Brain, Users, User, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RegisterForm } from '../components/forms/RegisterForm';
import { authState } from '../store/auth';
import { authService } from '../services/auth';
import { saveAuthData, getUserRole } from '../utils/auth';
import type { RegisterRequest } from '../types/types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const setAuth = useSetRecoilState(authState);
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/app/About');
    }
  }, [auth, navigate]);

  const handleRegister = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);

      const response = isAdmin
        ? await authService.registerAdmin({
            username: data.username,
            email: data.email,
            password: data.password,
            AdminPassword: data.AdminPassword,
            role: 'ADMIN',
          })
        : await authService.registerUser({
            name: data.username,
            email: data.email,
            password: data.password,
          });

      const { token, user } = response;
      const role = getUserRole(user);

      saveAuthData(token, user);
      setAuth({
        user,
        token,
        isAuthenticated: true,
        role,
      });

      toast.success('Registration successful! 🎉');
      navigate('/app/About');
    } catch (err: any) {
      const message = err.response?.data?.message || 'An error occurred during registration.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="w-full max-w-md space-y-8">
        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Branding */}
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
            Join thousands preparing for success
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex flex-wrap justify-center">
          <Link
            to="/register"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              !isAdmin
                ? 'bg-blue-100 text-blue-700 shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={(e) => isLoading && e.preventDefault()}
          >
            <User className="h-4 w-4" />
            <span>User Registration</span>
          </Link>
          <Link
            to="/register?admin=true"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              isAdmin
                ? 'bg-purple-100 text-purple-700 shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={(e) => isLoading && e.preventDefault()}
          >
            <Users className="h-4 w-4" />
            <span>Admin Registration</span>
          </Link>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl bg-white/80 backdrop-blur-md">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            title={isAdmin ? 'Create Admin Account' : 'Create Your Account'}
            isAdmin={isAdmin}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={`/login${isAdmin ? '?admin=true' : ''}`}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
