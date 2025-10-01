"use client";

import { Bell } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Your Order Has Been Verified",
    message: 'We have successfully verified your order for your "Nike Shoes" purchase.',
    time: "1h ago",
  },
  {
    id: 2,
    title: "Summer Fashion Sale Is Here!",
    message: "Summer fashion sale is here! Enjoy -50% OFF ALL PURCHASES!",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Your Order Has Been Verified",
    message: 'We have successfully verified your order for your "Nike Shoes" purchase.',
    time: "1h ago",
  },
  {
    id: 4,
    title: "Summer Fashion Sale Is Here!",
    message: "Summer fashion sale is here! Enjoy -50% OFF ALL PURCHASES!",
    time: "1h ago",
  },
];

export default function Notifications() {
  return (
    <div className="w-full mx-auto p-6 bg-white">
      <h2 className="text-xl font-semibold mb-2">Notification</h2>

      <div className="bg-white px-4 py-2 rounded-md text-gray-700 text-sm font-medium uppercase tracking-wide mb-4 border border-gray-200">
        Today
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 border-b border-gray-200 bg-white"
          >
            <div className="mt-1">
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.message}</p>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
