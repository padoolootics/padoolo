"use client";

import UserGreeting from "@/components/Dashboard/UserGreeting";
import AccountInfo from "@/components/Dashboard/AccountInfo";
import BillingAddress from "@/components/Dashboard/BillingAddress";
import StatusCards from "@/components/Dashboard/StatusCards";
import PaymentCards from "@/components/Dashboard/PaymentCards";
import RecentOrders from "@/components/Dashboard/RecentOrders";
import { useAuth } from "@/lib/Contexts/AuthContext";
import { useEffect, useState } from "react";
import { Order, WPUser } from "@/lib/api/types";
import { setToken } from "@/lib/api/services/httpServices";
import UserServices from "@/lib/api/services/UserServices";

export default function AccountDashboard() {
  const [user, setUser] = useState<WPUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);

    UserServices.getCurrentUserInfo()
      .then((res) => setUser(res))
      .catch((err) => console.error(err));

    UserServices.getOrders()
      .then((res) => setOrders(Array.isArray(res) ? res : [res]))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {user && <UserGreeting {...user} />}
      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Info */}
        {user && <AccountInfo {...user} />}

        {/* Billing Address */}
        {/* <BillingAddress
          showProfileImage
          {...user?.billing}
          onEditClick={() => console.log("Edit clicked")}
        /> */}

        {/* Status Cards */}
        {user && (
          <StatusCards
            total={user?.order_stats.total_orders}
            pending={user?.order_stats.pending}
            completed={user?.order_stats.delivered}
          />
        )}
      </div>

      {/* Payment Cards (static for now) */}
      {/* <PaymentCards /> */}

      {/* Recent Orders */}
        <RecentOrders orders={orders} />  
    </div>
  );
}
