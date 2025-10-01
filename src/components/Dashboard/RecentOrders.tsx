import { Order } from "@/lib/api/types";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RecentOrders(orders: { orders: Order[] }) {
  // console.log('Recent Orders:', orders);
  // return <p>  sfsdfs</p>;
  return (
    <div className="border border-gray-300 rounded-lg p-0 mt-6 bg-white">
      <div className="flex items-center justify-between mb-0 p-4">
        <h2 className="text-sm font-semibold text-gray-700">RECENT ORDER</h2>
        <button className="flex items-center text-sm font-medium text-blue-900 hover:underline cursor-pointer">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <hr className="border-b border-gray-300" />
      <div className="overflow-x-auto">
        {orders.orders.length === 0 ? (
          <div className="flex items-center justify-center p-6">
            {/* <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" /> */}
            <div className="text-center text-gray-500">
              No recent orders found.
            </div>
          </div>
        ) : (
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
              {orders.orders.map((order: Order, index: any) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 font-normal">
                    <span
                      className={`${
                        order.status === "delivered" ||
                        order.status === "completed" ||
                        order.status === "shipped"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {order.date_created}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{order.total}</td>
                  <td className="px-4 py-2">
                    <Link
                      href="/dashboard/orders/[id]"
                      as={`/dashboard/orders/${order.id}`}
                      prefetch={true}
                    >
                      <button className="flex items-center text-yellow-500 hover:underline font-medium cursor-pointer">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
