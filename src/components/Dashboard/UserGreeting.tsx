import { WPUser } from "@/lib/api/types";
import Link from "next/link";

export default function UserGreeting( user: WPUser | null ) {
  // console.log('user UserGreeting', user)
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Hello, {user ? user.first_name + ' ' + user.last_name : '' }</h2>
        <p className="text-sm text-gray-600 mb-6">
            From your account dashboard, you can easily check & view your{" "}
            <Link href="/dashboard/orders" prefetch={true} className="text-yellow-500 hover:underline font-normal">Recent Orders</Link>, manage your{" "}
            <Link href="/dashboard/settings" prefetch={true} className="text-yellow-500 hover:underline font-normal">Shipping and Billing Addresses</Link>{" "}
            and edit your <Link href="/dashboard/settings" prefetch={true} className="text-yellow-500 hover:underline font-normal">Password</Link> and{" "}
            <Link href="/dashboard/settings" prefetch={true} className="text-yellow-500 hover:underline font-normal">Account Details</Link>.
        </p>
      </div>
    );
  }
  