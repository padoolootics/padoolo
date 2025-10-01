import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white text-slate-800 text-sm">
            <div className="border-b">
                <div className="container m-auto">
                    {/* Top Icons Section */}
                    <div className="py-4 px-4 md:px-6 flex flex-wrap justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <Image src="/footer/free-delivery.png" alt="Free Shipping" width={60} height={60} />
                            <div>
                                <p className="font-semibold text-lg">Free Shipping</p>
                                <p className="text-xs font-normal text-slate-600">Free Shipping for orders above 499</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Image src="/footer/guarantee.png" alt="Money Guarantee" width={60} height={60} />
                            <div>
                                <p className="font-semibold text-lg">Money Guarantee</p>
                                <p className="text-xs font-normal text-slate-600">within 30 days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Image src="/footer/customer-service.png" alt="Online Support" width={60} height={60} />
                            <div>
                                <p className="font-semibold text-lg">Online Support</p>
                                <p className="text-xs font-normal text-slate-600">24 hours a day, 7 days a week</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Image src="/footer/credit-cards.png" alt="Flexible Payment" width={60} height={60} />
                            <div>
                                <p className="font-semibold text-lg">Flexible Payment</p>
                                <p className="text-xs font-normal text-slate-600">Pay with Multiple Credit Cards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Link Sections */}
            <div className="border-b">
                <div className="container m-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 md:px-6 py-14">
                        <div>
                            <h4 className="font-semibold mb-4">COMPANY INFO</h4>
                            <ul className="space-y-4 text-slate-600 text-base">
                                <li><Link href="/about">About Us</Link></li>
                                <li><Link href="/contact">Contact Us</Link></li>
                                <li><Link href="/dashboard">My Account</Link></li>
                                <li><Link href="/shop">Shop</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">SUPPORT</h4>
                            <ul className="space-y-4 text-slate-600 text-base">
                                <li><Link href="/">Order Status</Link></li>
                                <li><Link href="/">Shopping Support</Link></li>
                                <li><Link href="/shipping-and-returns-policy">Shipping & Returns Policy</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">SHOP BY</h4>
                            <ul className="space-y-4 text-slate-600 text-base">
                                <li><Link href="/sunglasses">Sunglasses</Link></li>
                                <li><Link href="/clothing">Clothes</Link></li>
                                <li><Link href="/new-arrivals">New Arrival</Link></li>
                                <li><Link href="/spotlight-deals">Spotlight Deals</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">MORE INFO</h4>
                            <ul className="space-y-4 text-slate-600 text-base">
                                <li><Link href="/faqs">FAQs</Link></li>
                                {/* <li><Link href="/">Customer Service</Link></li> */}
                                {/* <li><Link href="/">Manufactures</Link></li> */}
                                <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                            </ul>
                        </div>

                        {/* Sign Up and Social */}
                        


                        <div className="w-full md:w-[280px] text-center md:text-left">
                            <div className="mb-4">
                                <Image src="/padoolo1.png" alt="Logo" width={100} height={40} className="mb-4 mx-auto md:mx-0" />
                                
                                <h4 className="font-semibold mb-2">SIGN UP FOR EMAIL</h4>
                                <p className="text-xs text-slate-600 mb-3">
                                Enjoy 15% your first order when you signup to our newsletter.
                                </p>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-l text-sm focus:outline-none"
                                    />
                                    <button className="bg-amber-500 text-white px-4 rounded-r flex items-center">SIGN UP</button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col items-center md:flex-row md:items-start">
                                <p className="font-semibold mb-0 md:mr-4">FOLLOW US:</p>
                                <div className="flex space-x-3 text-xl text-slate-600">
                                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#"><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="container m-auto">
                <div className="flex flex-col md:flex-row justify-between items-center text-base px-4 md:px-6 py-6 text-slate-500">
                    <p className='text-center md:text-left'>Copyright ©2025 Padoolo. All Rights Reserved.</p>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        {/* <a href="#">Blog</a> */}
                        <a href="/privacy-policy">Privacy & Policy</a>
                        <a href="/terms-and-conditions">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
