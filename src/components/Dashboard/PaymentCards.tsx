'use client';

import { useState } from 'react';
import CardItem from '@/components/Dashboard/CardItem';
import { ArrowRight } from 'lucide-react';
import AddCardModal from '@/components/modal/AddCardModal';

export default function PaymentCards() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="border border-gray-300 rounded-lg p-0 mt-6 bg-white">
      <div className="flex justify-between p-4">
        <h4 className="font-medium text-sm text-gray-700">PAYMENT OPTION</h4>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-sm font-medium text-blue-900 hover:underline cursor-pointer"
        >
          Add Card
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <hr className="border-b border-gray-300" />
      <div className="md:flex block gap-4 p-4">
        <CardItem
          bgColor="bg-blue-800"
          amount="95,400.00"
          cardNumber="**** **** **** 3814"
          brandLogo="/images/visa.png"
          brandName="Visa"
          holder="Kevin Gilbert"
        />
        <CardItem
          bgColor="bg-green-600"
          amount="87,583.00"
          cardNumber="**** **** **** 1761"
          brandLogo="/images/mastercard.png"
          brandName="Mastercard"
          holder="Kevin Gilbert"
        />
      </div>

      <AddCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
