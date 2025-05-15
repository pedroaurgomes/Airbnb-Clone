'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { jwtDecode } from 'jwt-decode';

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
      const decodedToken = jwtDecode(data.access_token);
      console.log('Decoded token:', decodedToken);
      
      // Extract the role from the decoded token
      const role = decodedToken.role;
      console.log('User role:', role);

      // Login with the token and role
      login(data.access_token, role);
      
      // Navigate to home page
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center">Log In</h1>

        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
        />

        {error && (
          <p className="text-rose-500 text-sm text-center">{error}</p>
        )}

        <Button
          label={loading ? 'Logging In...' : 'Log In'}
          type="submit"
        />
      </form>
    </div>
  );
}
