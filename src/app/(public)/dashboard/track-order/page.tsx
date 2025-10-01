"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { CheckIcon, UserIcon, XIcon } from "lucide-react";

const order = {
  id: "#96459761",
  placedDate: "13 June, 2025 at 7:32 PM",
  arrivalDate: "23 June, 2025",
  total: "$1199.00",
  products: [
    {
      name: "Sport Shoes",
      desc: "Origins, as well as a random Lorem Ipsum generator.",
      price: 149,
      qty: 1,
      image: "/shoes.png",
    },
    {
      name: "Sunglasses",
      desc: "Reference site about Lorem Ipsum, giving information on its origins.",
      price: 39,
      qty: 1,
      image: "/sunglasses.png",
    },
  ],
  steps: ["Order Placed", "Packaging", "On The Way", "Delivered"],
  currentStep: 2,
  activity: [
    {
      date: "23 Jan, 2021 at 7:32 PM",
      text: "Your order has been delivered. Thank you for shopping at Citcon!",
      done: true,
    },
    {
      date: "23 Jan, 2021 at 2:00 PM",
      text: "Our delivery man (John Wick) has picked-up your order for delivery.",
      done: false,
    },
    {
      date: "22 Jan, 2021 at 8:00 AM",
      text: "Your order has reached at last mile hub.",
      done: false,
    },
    {
      date: "21 Jan, 2021 at 5:32 AM",
      text: "Your order on the way to [last mile] hub.",
      done: false,
    },
    {
      date: "20 Jan, 2021 at 7:32 PM",
      text: "Your order is successfully verified.",
      done: true,
    },
    {
      date: "19 Jan, 2021 at 2:61 PM",
      text: "Your order has been confirmed.",
      done: true,
    },
  ],
};

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

export default function TrackOrder() {
  const [showDetails, setShowDetails] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  const handleTrack = () => {
    // Add your validation logic here if needed
    setShowDetails(true);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white">
      <h2 className="text-xl font-semibold mb-2">Track Order</h2>
      <p className="text-gray-600 mb-4">
        To track your order please enter your order ID in the input field below and press
        the “Track Order” button. This was given to you on your receipt and in the confirmation
        email you should have received.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ID..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Billing Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Info className="w-4 h-4 mr-1" />
        Order ID that we sent to your in your email address.
      </div>

      {!showDetails && (
        <button
          onClick={handleTrack}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-sm transition cursor-pointer"
        >
          TRACK ORDER →
        </button>
      )}

      {showDetails && (
        <div>
          <div className="px-0">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">{order.id}</div>
                <div className="text-sm text-gray-500">
                  {order.products.length} Products · Order Placed in{" "}
                  {order.placedDate}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{order.total}</div>
            </div>
          </div>

          <div className="px-0 py-6 border-b border-gray-300">
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
                    <img
                      src={step.icon}
                      alt={step.label}
                      className="w-6 h-6 mt-4 mb-1"
                    />
                    <p className="text-xs text-gray-700 w-24">{step.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 pb-6 border border-gray-200">
            <h2 className="font-semibold text-gray-800 mb-4 mt-4">Order Activity</h2>
            <ul className="space-y-6">
              {order.activity.map((item, i) => (
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
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
