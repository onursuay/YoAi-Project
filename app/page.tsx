'use client';

import { useRouter } from 'next/navigation';
import LoginScreen from '@/frames/LoginScreen';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return <LoginScreen onLogin={handleLogin} />;
}

