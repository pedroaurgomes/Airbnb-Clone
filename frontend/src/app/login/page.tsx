'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  role: 'guest' | 'host';
  exp: number;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response data:', data);

      // Decode the JWT token to get the role
      const decodedToken = jwtDecode<JWTPayload>(data.access_token);
      console.log('Decoded token:', decodedToken);
      
      // Extract the role from the decoded token
      const role = decodedToken.role;
      console.log('User role:', role);

      // Login with the token and role
      login(data.access_token, role);
      
      // Navigate based on role
      if (role === 'host') {
        router.push('/host');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              label="Email address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              label={loading ? 'Signing in...' : 'Sign in'}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
