"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon, UserIcon, XIcon } from "lucide-react";
import FeedbackModal from "@/components/modal/FeedbackModal";
import { Order } from "@/lib/api/types";
import { setToken } from "@/lib/api/services/httpServices";
import UserServices from "@/lib/api/services/UserServices";


const trackingData = {
  arrivalDate: "23 June, 2025",
  currentStep: 1,
  steps: [
    { label: "Order Placed", icon: "/order-placed.png" },
    { label: "Packaging", icon: "/packaging.png" },
    { label: "On The Way", icon: "/logistics.png" },
    { label: "Delivered", icon: "/delivered.png" },
  ],
};

export default function OrderPage({ orderID }: { orderID: string }) {
  const [order, setOrder] = useState<Order>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);

    UserServices.getOrderById(Number(orderID))
      .then((res) => setOrder(res))
      .catch((err) => console.error(err));
  }, [orderID]);

  if (!order) {
    return <div className="text-center p-6">Order not found!</div>;
  }

  return (
    <div className="bg-white mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 p-6">
        <Link
          href={`/dashboard/orders`}
          className="flex items-center text-sm text-yellow-500 hover:underline font-medium cursor-pointer"
        >
          <h1>← ORDER DETAILS</h1>
        </Link>
        <button
          className="text-sm text-orange-500 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Leave a Rating +
        </button>
      </div>

      {/* Order Summary */}
      <div className="px-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-800">{order.id}</div>
            <div className="text-sm text-gray-500">
              {order.line_items.length} Products · Order Placed in{" "}
              {order.date_created}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{order.total}</div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="px-6 pb-6 border-b border-gray-300">
        <p className="text-sm text-gray-600 mb-2">
          Order expected arrival <strong>{trackingData.arrivalDate}</strong>
        </p>
        <div className="relative flex justify-between items-start">
          {trackingData.steps.map((step, index) => {
            const isCompleted = index < trackingData.currentStep;
            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1 relative text-center"
              >
                {index < trackingData.steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 h-1 w-full transform translate-x-5 ${
                      isCompleted ? "bg-yellow-400" : "bg-gray-300"
                    }`}
                    style={{ zIndex: 0 }}
                  />
                )}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-10 ${
                    isCompleted
                      ? "bg-yellow-500 border-yellow-500"
                      : "bg-yellow-500 border-yellow-500"
                  }`}
                >
                  {isCompleted && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
                <Image
                  src={step.icon}
                  alt={step.label}
                  className="w-6 h-6 mt-4 mb-1"
                  width={24}
                  height={24}
                />
                <p className="text-xs text-gray-700 w-24">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-6 pb-6 border-b border-gray-300">
        <h2 className="font-semibold text-gray-800 mb-4">Order Activity</h2>
        <ul className="space-y-6">
          {/* {order.activity.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center mt-1 ${
                  item.done
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-50 text-blue-900"
                }`}
              >
                {item.done ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-800">{item.text}</p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            </li>
          ))} */}
        </ul>
      </div>

      {/* Product List */}
      <div className="border-b border-gray-300">
        <h2 className="font-semibold text-gray-800 px-6 pb-6">
          Product ({order.line_items.length})
        </h2>
        <table className="w-full text-sm border-t">
          <thead>
            <tr className="text-left text-gray-500 font-normal border-b border-gray-300 bg-gray-50">
              <th className="py-2 px-6">Products</th>
              <th className="py-2 px-6">Price</th>
              <th className="py-2 px-6">Quantity</th>
              <th className="py-2 px-6">Sub-total</th>
            </tr>
          </thead>
          <tbody>
            {order.line_items.map((product: any, i:any) => (
              <tr key={i} className="border-b border-gray-300">
                <td className="py-2 px-6 flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded">
                    <Image
                      src={typeof product.image.src === "string" ? product.image.src : ""}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {product.name}
                    </div>
                    {/* <div className="text-xs text-gray-500">{product.}</div> */}
                  </div>
                </td>
                <td className="py-3">${product.price}</td>
                <td className="py-3">x{product.quantity}</td>
                <td className="py-3">${product.price * product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Addresses and Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 px-6 pb-6">
        <div>
          <h4 className="font-semibold mb-3 text-lg text-black">
            Billing Address
          </h4>
          <p className="font-normal mb-2 text-md text-black">{order.billing.first_name + ' ' + order.billing.last_name}</p>
          <p className="font-normal mb-2 text-md text-gray-500">
            {order.billing.address_1}, {order.billing.city}, {order.billing.state} - {order.billing.postcode}, {order.billing.country}
          </p>
          <p className="font-normal mb-2 text-md text-gray-500">
            <span className="text-black">Phone Number:</span>{order.billing.phone}
          </p>
          <p className="font-normal mb-2 text-md text-gray-500">
            <span className="text-black">Email:</span> {order.billing.email}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-lg">Shipping Address</h4>
          <p className="font-normal mb-2 text-md text-black">{order.shipping.first_name + ' ' + order.shipping.last_name}</p>
          <p className="font-normal mb-2 text-md text-gray-500">
            {order.shipping.address_1}, {order.shipping.city}, {order.shipping.state} - {order.shipping.postcode}, {order.shipping.country}
          </p>
          <p className="font-normal mb-2 text-md text-gray-500">
            <span className="text-black">Phone Number:</span>{order.shipping.phone}
          </p>
          <p className="font-normal mb-2 text-md text-gray-500">
            <span className="text-black">Email:</span> {order.shipping.email}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-lg">Order Notes</h4>
          <p className="font-normal mb-2 text-md text-gray-500">
            {order.customer_note || "No additional notes provided."}
          </p>
        </div>
      </div>

      {/* Rating Modal */}
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
