"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import UserServices from "@/lib/api/services/UserServices";
import { Order } from "@/lib/api/types";
import { setToken } from "@/lib/api/services/httpServices";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";

// type Order = {
//   id: string;
//   status: "COMPLETED" | "CANCELED";
//   date: string; // ISO format
//   total: string;
//   products: number;
// };

// const ordersData: Order[] = [
//   {
//     id: "#71667167",
//     status: "COMPLETED",
//     date: "2025-06-02T19:28:00",
//     total: "$80",
//     products: 11,
//   },
//   {
//     id: "#95214362",
//     status: "CANCELED",
//     date: "2025-03-20T23:14:00",
//     total: "$160",
//     products: 3,
//   },
//   {
//     id: "#71667167",
//     status: "COMPLETED",
//     date: "2025-02-02T19:28:00",
//     total: "$80",
//     products: 11,
//   },
//   {
//     id: "#71667167",
//     status: "COMPLETED",
//     date: "2015-01-15T19:28:00",
//     total: "$80",
//     products: 11,
//   },
//   {
//     id: "#95214362",
//     status: "CANCELED",
//     date: "2014-12-20T23:14:00",
//     total: "$160",
//     products: 3,
//   },
//   {
//     id: "#71667167",
//     status: "COMPLETED",
//     date: "2025-06-02T19:28:00",
//     total: "$80",
//     products: 11,
//   },
//   {
//     id: "#95214362",
//     status: "CANCELED",
//     date: "2025-03-20T23:14:00",
//     total: "$160",
//     products: 3,
//   },
//   {
//     id: "#71667167",
//     status: "COMPLETED",
//     date: "2025-02-02T19:28:00",
//     total: "$80",
//     products: 11,
//   },
// ];

const ITEMS_PER_PAGE = 5;

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);

    UserServices.getOrders()
      .then((res) => setOrders(Array.isArray(res) ? res : [res]))
      .catch((err) => console.error(err));
  }, []);

  // const totalPages = Math.ceil(ordersData.length / ITEMS_PER_PAGE);
  // const paginatedOrders = ordersData.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-md overflow-hidden">
      <div className="p-4 font-semibold text-gray-800 border-b">
        ORDER HISTORY
      </div>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center p-6">
          {/* <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin" /> */}
          <div className="text-center text-gray-500">
              No recent orders found.
            </div>
        </div>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 font-normal border-b border-gray-300 bg-gray-50">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b border-gray-300">
                <td className="px-4 py-3 font-normal text-black">{order.id}</td>
                <td
                  className={`px-4 py-3 font-normal ${
                    order.status === "delivered" || order.status === "completed" || order.status === "shipped"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {formatDate(order.date_created)}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {order.total} ({order.line_items.length} Products)
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center text-yellow-500 hover:underline font-medium cursor-pointer"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {/* <div className="flex items-center justify-center p-4 border-t bg-gray-50"> */}
        {/* <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="w-8 h-8 rounded-full border hover:bg-gray-200 disabled:opacity-30 mr-2 flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button> */}

        {/* <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-full border text-sm  cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-900 text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div> */}

        {/* <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="w-8 h-8 rounded-full border hover:bg-gray-200 disabled:opacity-30 ml-2 flex items-center justify-center cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
        </button> */}
      {/* </div> */}
    </div>
  );
}
