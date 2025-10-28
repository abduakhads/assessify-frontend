'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { setTokens } from '@/utils/auth';
import { motion } from 'framer-motion';

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
      router.push('/home'); 
    } catch (err: any) {
      console.log(err)
        setError(err?.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2>Login to your account</h2>

        <div>
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
            variant={'outline'}
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
