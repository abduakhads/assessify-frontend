'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { setTokens } from '@/utils/auth';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  const router = useRouter();

  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/token/`, {
        username,
        password,
      });

      const { access: accessToken, refresh: refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      // redirect after login successfull 
      router.push('/dashboard'); 
    } catch (err: any) {
      console.log(err)
        setError(err?.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#01cd6a] via-emerald-400 to-green-300 px-4">
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login to your account</h2>

        <div className="space-y-4">
          <Input
            placeholder="username"
            type="username"
            value={username}
            onChange={e => setusername(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            className="w-full bg-[#01cd6a] hover:bg-[#00b35b]"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
