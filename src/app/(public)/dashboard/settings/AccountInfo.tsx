"use client";

import { setAuthToken } from "@/lib/api/services/httpServices";
import UserServices from "@/lib/api/services/UserServices";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface AccountInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const AccountInfo: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch the user data
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setAuthToken(localStorage.getItem("token"));
      const response = await UserServices.getCurrentUserInfo();

      setAccountInfo({
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
        phone: response.phone,
      });

      setLoading(false);
    };
    fetchUserInfo();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthToken(localStorage.getItem("token"));
    const response = await UserServices.updateCurrentUserInfo(accountInfo);
    if (response.success) {
      toast.success(`${response.message}`);
      setLoading(false);
    } else {
      toast.error(`Failed to update account information`);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 w-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={accountInfo.first_name}
            onChange={(e) =>
              setAccountInfo({ ...accountInfo, first_name: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={accountInfo.last_name}
            onChange={(e) =>
              setAccountInfo({ ...accountInfo, last_name: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={accountInfo.email}
            onChange={(e) =>
              setAccountInfo({ ...accountInfo, email: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={accountInfo.phone}
            onChange={(e) =>
              setAccountInfo({ ...accountInfo, phone: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto cursor-pointer px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-500 rounded-md shadow-md"
      >
        {loading ? "Processing..." : "Save Account Info"}
      </button>
    </form>
  );
};

export default AccountInfo;
