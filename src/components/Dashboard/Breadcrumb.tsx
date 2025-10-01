"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountInfo() {
  const pathname = usePathname(); // e.g. "/user-account/dashboard"
  const segments = pathname.split("/").filter(Boolean); // ['user-account', 'dashboard']

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = decodeURIComponent(segment.replace(/-/g, " ")); // optional formatting

    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href,
    };
  });

  return (
    <nav className="text-sm mb-6">
      <ol className="flex text-gray-600 list-none">
        <li>
          <Link href="/" className="hover:underline">Home</Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            <span className="mx-2">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-yellow-500 font-normal">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline">{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
