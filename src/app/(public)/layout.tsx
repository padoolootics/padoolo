import React  from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Toaster } from 'react-hot-toast';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-0 space-y-0">
      <Header />
      {children}
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

