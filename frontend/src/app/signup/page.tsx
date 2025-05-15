'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import RoleSelector from '@/components/RoleSelector';
import { apiPost } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface SignupResponse {
  user: {
    user_id: number;
    name: string;
    email: string;
    role: string;
  };
  access_token: string;
  token_type: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!role) {
      setError('Please select a role.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = {
        name,
        email,
        password,
        role,
      };

      const response = await apiPost<SignupResponse>('/v1/users/signup', data);

      if (!response.access_token) {
        throw new Error('No access token received from server');
      }

      // Login with the token and role
      login(response.access_token, response.user.role);

      // Redirect based on role
      if (response.user.role === 'host') {
        router.push('/host');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Something went wrong.');
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
        <h1 className="text-2xl font-bold text-gray-900 text-center">Sign Up</h1>

        <InputField
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
        />

        <RoleSelector
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        {error && (
          <p className="text-rose-500 text-sm text-center">{error}</p>
        )}

        <Button
          label={loading ? 'Signing Up...' : 'Sign Up'}
          type="submit"
        />
      </form>
    </div>
  );
}
