'use client';

import { useAuth } from "@/lib/Contexts/AuthContext";
import Link from "next/link";


export default function Topbar() {
const { isAuthenticated } = useAuth();
  return (
    <div className="hidden lg:block w-full bg-white border-b border-gray-200 text-sm">
        <div className="container m-auto">
            <div className="w-full mx-auto px-4 flex items-center justify-between h-10">
                {/* Left - Social Icons (substitutes) */}
                {/* <div className="flex items-center space-x-2 text-[#011e41]">
                    <SquaresPlusIcon className="h-5 w-5 cursor-pointer" />
                    <CursorArrowRaysIcon className="h-5 w-5 cursor-pointer" />
                    <ChartPieIcon className="h-5 w-5 cursor-pointer" />
                    <FingerPrintIcon className="h-5 w-5 cursor-pointer" />
                </div> */}

                {/* Center - Announcement */}
                <div className="text-center text-gray-700">
                    Summer sale discount off 70%{" "}
                    <Link href="/shop" className="font-semibold text-[#011e41] underline hover:no-underline" prefetch={true}>
                        Shop Now
                    </Link>
                </div>

                {/* Right - Links */}
                <div className="flex items-center space-x-5 text-[#011e41] font-medium">
                    <Link href="/about" prefetch={true} >About</Link>
                    {isAuthenticated ? (
                        <Link href="/dashboard" className="text-[#011e41] hover:underline" prefetch={true}>
                            Dashboard
                        </Link>
                    ) : (
                        <Link href="/login" className="text-[#011e41] hover:underline" prefetch={true}>
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}


