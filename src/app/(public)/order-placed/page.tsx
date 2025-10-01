"use client";

import { CheckCircleIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    // Cleanup timeout if the component is unmounted before 5 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-8 py-10">
        <CheckCircleIcon className="h-20 w-20 text-green-500 mb-4 " />
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 text-lg">
          Thank you for your purchase. Your order has been placed
          successfully.
        </p>
        <p className="text-gray-800 font-semibold text-xl mt-4">
          You will be redirected to the homepage shortly.
        </p>
      </div>
    </div>
  );
};

export default Page;