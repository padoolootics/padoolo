"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RocketIcon, FileTextIcon, PackageIcon, ArrowRight } from 'lucide-react';
import CardItem from '@/components/Dashboard/CardItem';
import PaymentCards from '@/components/Dashboard/PaymentCards';
import BillingAddress from '@/components/Dashboard/BillingAddress';

const orders = [
  {
    id: '#71667167',
    status: 'COMPLETED',
    date: 'June 2, 2025 19:28',
    total: '$80 (11 Products)',
  },
  {
    id: '#95214362',
    status: 'CANCELED',
    date: 'Mar 20, 2025 23:14',
    total: '$160 (3 Products)',
  },
  {
    id: '#71667167',
    status: 'COMPLETED',
    date: 'Feb 2, 2025 19:28',
    total: '$80 (11 Products)',
  },
  {
    id: '#71667167',
    status: 'COMPLETED',
    date: 'Jan 15, 2015 19:28',
    total: '$80 (11 Products)',
  },
  {
    id: '#95214362',
    status: 'CANCELED',
    date: 'Dec 20, 2014 23:14',
    total: '$160 (3 Products)',
  },
];

export default function Address() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="md:flex block gap-6">
          {/* Main Content */}
          <main className="flex-1 space-y-6">
          <h2 className="text-xl font-semibold mb-2">Cards & Address</h2>
            {/* Payment Cards (static for now) */}
            <PaymentCards />
            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Info */}
              <BillingAddress
                title="Billing Address"
                showDelete
                onDeleteClick={() => console.log("Deleted")}
                user={{
                  name: 'Kevin Gilbert',
                  addressLine: 'East Bazar, Word No. 04...',
                  email: 'kevin.gilbert@gmail.com',
                  phone: '+1-202-555-0118'
                }}
                onEditClick={() => console.log("Edit clicked")}
              />


              {/* Billing Address */}
              <BillingAddress
              title="Shipping Address"
              showDelete
              onDeleteClick={() => console.log("Deleted")}
              user={{
                name: 'Kevin Gilbert',
                addressLine: 'East Bazar, Word No. 04...',
                email: 'kevin.gilbert@gmail.com',
                phone: '+1-202-555-0118'
              }}
              onEditClick={() => console.log("Edit clicked")}
            />


            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
