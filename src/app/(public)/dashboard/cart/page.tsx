"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RocketIcon, FileTextIcon, PackageIcon, ArrowRight } from 'lucide-react';
import CardItem from '@/components/Dashboard/CardItem';

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

export default function AccountDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="list-reset flex text-gray-600">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
              <Link href="/user-account">User Account</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
              <span className="text-yellow-500 font-normal">Dashboard</span>
            </li>
          </ol>
        </nav>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow rounded-xl p-4 space-y-2">
            <div className="font-semibold text-lg mb-2">Dashboard</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><Link href="#" className="block px-3 py-2 rounded bg-yellow-100 text-yellow-600 font-medium">Dashboard</Link></li>
              <li><Link href="#" className="block px-3 py-2 rounded hover:bg-gray-100">Order History</Link></li>
              <li><Link href="#" className="block px-3 py-2 rounded hover:bg-gray-100">Track Order</Link></li>
              <li><Link href="#" className="block px-3 py-2 rounded hover:bg-gray-100">Shopping Cart</Link></li>
              <li><Link href="#" className="block px-3 py-2 rounded hover:bg-gray-100">Wishlist</Link></li>
              <li><Link href="#" className="block px-3 py-2 rounded hover:bg-gray-100">Cards & Address</Link></li>
              <li><Link href="#" className="block px-3 py-2 rounded hover:bg-gray-100">Setting</Link></li>
              <li><Link href="#" className="block px-3 py-2 rounded hover:bg-gray-100">Log-out</Link></li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <h2 className="text-xl font-semibold mb-2">Hello, Kevin</h2>
            <p className="text-sm text-gray-600 mb-6">
              From your account dashboard, you can easily check & view your{" "}
              <a href="#" className="text-yellow-500 hover:underline font-normal">Recent Orders</a>, manage your{" "}
              <a href="#" className="text-yellow-500 hover:underline font-normal">Shipping and Billing Addresses</a>{" "}
              and edit your <a href="#" className="text-yellow-500 hover:underline font-normal">Password</a> and{" "}
              <a href="#" className="text-yellow-500 hover:underline font-normal">Account Details</a>.
            </p>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Account Info */}
              <div className="md:col-span-1 border border-gray-300 rounded p-0 bg-white">
                <h4 className="text-sm font-medium text-black p-4">ACCOUNT INFO</h4>
                <hr className="border-b border-gray-300" />
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <Image
                      src="/images/Image-7.png"
                      alt="Kevin Gilbert"
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-semibold text-gray-800">Kevin Gilbert</h5>
                      <p className="text-sm text-gray-500">Indore - 1207, Madhya Pradesh</p>
                    </div>
                  </div>
                  <p className="text-sm text-black mt-2 mb-3">Email: <a href="mailto:kevin.gilbert@gmail.com" className="text-gray-400">kevin.gilbert@gmail.com</a></p>
                  <p className="text-sm text-black mb-3">Sec Email: <a href="mailto:kevin12345@gmail.com" className="text-gray-400">kevin12345@gmail.com</a></p>
                  <p className="text-sm text-black">Phone: <a href="tel:+12025550118" className="text-gray-400">+1-202-555-0118</a></p>
                  <button className="mt-4 text-sm border border-yellow-500 text-yellow-500 hover:bg-yellow-50 px-4 py-3 rounded cursor-pointer">
                    EDIT ACCOUNT
                  </button>
                </div>
              </div>

              {/* Billing Address */}
              <div className="md:col-span-1 border border-gray-300 rounded p-0 bg-white">
                <h4 className="text-sm font-medium text-black p-4">BILLING ADDRESS</h4>
                <hr className="border-b border-gray-300" />
                <div className="p-4">
                  <p className="text-sm text-gray-700 font-semibold">Kevin Gilbert</p>
                  <p className="text-sm text-gray-500 mt-1 mb-3">East Bazar, Word No. 04, Road No. 13/k, House no. 1320/C, Flat No. 5D, Indore - 1207, Madhya Pradesh</p>
                  <p className="text-sm text-black mb-3">Phone: <a href="tel:+12025550118" className="text-gray-400">+1-202-555-0118</a></p>
                  <p className="text-sm text-black mb-3">Email: <a href="mailto:kevin.gilbert@gmail.com" className="text-gray-400">kevin.gilbert@gmail.com</a></p>
                  <button className="mt-4 text-sm border border-yellow-500 text-yellow-500 hover:bg-yellow-50 px-4 py-3 rounded cursor-pointer">
                    EDIT ADDRESS
                  </button>
                </div>
              </div>

              {/* Status Cards */}
              <div className="flex flex-col gap-4">
                <div className="space-y-5">
                  {/* Total Orders */}
                  <div className="flex items-center gap-4 p-4 rounded-md bg-blue-50">
                    <div className="text-blue-500 bg-white p-3">
                      <RocketIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-black">26</p>
                      <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                  </div>

                  {/* Pending Orders */}
                  <div className="flex items-center gap-4 p-4 rounded-md bg-yellow-50">
                    <div className="text-yellow-500 bg-white p-3">
                      <FileTextIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-black">05</p>
                      <p className="text-sm text-gray-500">Pending Orders</p>
                    </div>
                  </div>

                  {/* Completed Orders */}
                  <div className="flex items-center gap-4 p-4 rounded-md bg-green-50">
                    <div className="text-green-500 bg-white p-3">
                      <PackageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-black">21</p>
                      <p className="text-sm text-gray-500">Completed Orders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Cards (static for now) */}
            <section className="border border-gray-300 rounded-lg p-0 mt-6 bg-white">
              <div className="flex justify-between p-4">
                <h4 className="font-medium text-sm text-gray-700">PAYMENT OPTION</h4>
                <button className="text-sm text-blue-900 hover:underline cursor-pointer">Add Card →</button>
              </div>
              <hr className="border-b border-gray-300" />
              <div className="flex gap-4 p-4">
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
            </section>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-300 rounded-lg">
              <div className="flex items-center justify-between mb-0 p-4">
                <h2 className="text-sm font-semibold text-gray-700">RECENT ORDER</h2>
                <button className="flex items-center text-sm font-medium text-blue-900 hover:underline">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <hr className="border-b border-gray-300" />
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="text-gray-600 border-b border-gray-300 bg-gray-50">
                      <th className="px-4 py-3 font-medium">ORDER ID</th>
                      <th className="px-4 py-3 font-medium">STATUS</th>
                      <th className="px-4 py-3 font-medium">DATE</th>
                      <th className="px-4 py-3 font-medium">TOTAL</th>
                      <th className="px-4 py-3 font-medium">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="px-4 py-3 font-medium text-gray-800">{order.id}</td>
                        <td className="px-4 py-3 font-normal">
                          <span
                            className={`${
                              order.status === 'COMPLETED' ? 'text-green-600' : 'text-red-500'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-700">{order.date}</td>
                        <td className="px-4 py-2 text-gray-700">{order.total}</td>
                        <td className="px-4 py-2">
                          <button className="flex items-center font-normal text-yellow-500 hover:underline font-medium cursor-pointer">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
