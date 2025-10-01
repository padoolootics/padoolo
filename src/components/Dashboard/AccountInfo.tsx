import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WPUser } from "@/lib/api/types";

export default function AccountInfo(user: WPUser | null) {
    console.log("User data in AccountInfo:", user);
    const firstLetter = user && user.first_name.charAt(0).toUpperCase();
    return (
        <div className="md:col-span-1 border border-gray-300 rounded p-0 bg-white">
            <h4 className="text-sm font-medium text-black p-4">ACCOUNT INFO</h4>
            <hr className="border-b border-gray-300" />
            <div className="p-4">
                <div className="flex items-start gap-4">
                {/* <Image
                    src="/images/Image-7.png"
                    alt="Kevin Gilbert"
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                /> */}
                <span>
                    {firstLetter ? (
                        <div className="h-10 w-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-semibold">
                            {firstLetter}
                        </div>
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300" />
                    )}
                </span>
                <div>
                    <h5 className="font-semibold text-gray-800">{user ? user.first_name + ' ' + user.last_name : 'Customer'}</h5>
                    {/* <p className="text-sm text-gray-500">{user ? user.email : '-' }</p> */}
                </div>
            </div>
            <p className="text-sm text-black mt-2 mb-3">Email: <span className="text-gray-400">{user ? user.email : '-' }</span></p>
            <p className="text-sm text-black">Phone: <span className="text-gray-400">{user ? user.phone : ''}</span></p>
            <Link href="/dashboard/settings" prefetch={true}> 
            <button className="mt-4 text-sm border border-yellow-500 text-yellow-500 hover:bg-yellow-50 px-4 py-3 rounded cursor-pointer">
                EDIT ACCOUNT
            </button>
            </Link>
        </div>
    </div>
    );
}
  