"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // Import clsx
import { setAuthToken } from "@/lib/api/services/httpServices";
import { useAuth } from "@/lib/Contexts/AuthContext";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/orders", label: "Order History" },
  { href: "/dashboard/track-order", label: "Track Order" },
  // { href: '/dashboard/wishlist', label: 'Wishlist' },
  { href: "/dashboard/address", label: "Card & Address" },
  // { href: '/dashboard/notifications', label: 'Notifications' },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/login", label: "Logout" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-full md:w-64 bg-white shadow-md py-0 px-0 mb-4 md:mb-0">
      <ul className="space-y-0">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={clsx(
                "block px-4 py-3 hover:bg-yellow-400 hover:text-white transition",
                pathname === link.href
                  ? "bg-yellow-500 text-white font-medium"
                  : ""
              )}
              onClick={() => {
                if (link.href === "/login") {
                  logout();
                  setAuthToken(null); // Clear the auth token on logout
                }
              }}
              prefetch={true}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
