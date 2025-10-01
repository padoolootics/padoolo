'use client';

import { useAuth } from '@/lib/Contexts/AuthContext';
import React from 'react'

const MyAccount = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Redirecting...</p>; // Or you can display a loading indicator
  }

  return <div>Welcome to the protected page!</div>;
};

export default MyAccount;
