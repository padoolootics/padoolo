'use client';

import Link from 'next/link';

export default function InvoicePage() {
    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="container m-auto">
                {/* Breadcrumb Section */}
                <div className="py-6 px-6">
                    <div className="w-full mx-auto">
                        <nav className="text-sm text-gray-500 mb-2">
                            <ol className="flex items-center justify-center space-x-2">
                                <li>
                                    <Link href="/" className="hover:underline text-yellow-400 text-lg">Checkout</Link>
                                </li>
                                <li className="text-gray-400 text-lg font-bold pl-4 pr-4">•••</li>
                                <li className="text-gray-800 text-lg">Address</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {/* Main Cart Section */}
                <div className="w-full mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Section: Thank You + Billing */}
                        <div className="md:col-span-2">
                            <h1 className="text-3xl font-bold text-black mb-2">Thank you for your <br /> purchase!</h1>
                            <p className="text-gray-600 mb-10">
                                Your order will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.
                            </p>
                
                            {/* Billing Info */}
                            <div>
                                <h2 className="font-semibold mb-3">Billing Address</h2>
                                <div className="text-sm text-gray-800 space-y-4">
                                <p><span className="mr-10"><strong>Name:</strong></span> John Smith</p>
                                <p><span className="mr-6"><strong>Address:</strong></span> 456, Oak St #3b San Francisco CA 94102, United States</p>
                                <p><span className="mr-8"><strong>Phone:</strong></span> +1 (415) 555-1234</p>
                                <p><span className="mr-10"><strong>Email:</strong></span> johnsmith@gmail.com</p>
                                </div>
                            </div>
                
                            <button className="mt-6 bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-950">
                                Track Your Order
                            </button>
                        </div>
            
                        {/* Right Section: Order Summary */}
                        <div className="bg-white border border-gray-300 p-6">
                            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                            <div className="flex flex-col md:flex-row items-start md:items-start md:space-x-6 w-full">
                                <div>
                                    <p className="text-sm text-gray-600">Date</p>
                                    <h5 className="font-medium text-black text-md">10 June, 2025</h5>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order Number</p>
                                    <h5 className="font-medium text-black text-md">024-1235458967</h5>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <h5 className="font-medium text-black text-md">Mastercard</h5>
                                </div>
                            </div>
            
                            {/* Product List */}
                            <div className="divide-y">
                                {[1, 2].map((_, i) => (
                                <div key={i} className="flex items-start py-4 space-x-4">
                                    <img src="/images/dress-red.png" alt="product" className="w-16 h-20 object-cover rounded" />
                                    <div className="flex-1">
                                        <p className="font-medium">Midi dress with 2 straps</p>
                                        <p className="text-sm text-gray-500">$265</p>
                                    </div>
                                    <div className="text-sm text-gray-500">Qty. 1</div>
                                </div>
                                ))}
                            </div>
            
                            {/* Totals */}
                            <div className="mt-4 text-sm space-y-1">
                                <div className="bg-gray-100 p-6 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>----</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Discount</span>
                                        <span>$10.50</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 font-medium">
                                        <span>Tax</span>
                                        <span>$2.50</span>
                                    </div>
                                </div>
                                <div className="flex justify-between font-normal text-lg mt-2">
                                    <span>ORDER TOTAL</span>
                                    <span>$532.50</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
  