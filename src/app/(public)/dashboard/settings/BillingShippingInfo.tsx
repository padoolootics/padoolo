'use client'

import { setAuthToken } from "@/lib/api/services/httpServices";
import UserServices from "@/lib/api/services/UserServices";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface BillingShippingInfo {
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

const BillingShippingInfo: React.FC<{ type: "billing" | "shipping" }> = ({ type }) => {
  const [info, setInfo] = useState<BillingShippingInfo>({
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      setAuthToken(localStorage.getItem("token"));
      const response = await UserServices.getCurrentUserInfo();

      if (type === "billing") {
        setInfo({
          address_1: response.billing.address_1 || "",
          address_2: response.billing.address_2 || "",
          city: response.billing.city || "",
          state: response.billing.country || "",
          postcode: response.billing.postcode || "",
          country: response.billing.country || "",
        });
        setLoading(false);
      // setInfo(response);
      } else {
        setInfo({
          address_1: response.shipping.address_1 || "",
          address_2: response.shipping.address_2 || "",
          city: response.shipping.city || "",
          state: response.shipping.state || "",
          postcode: response.shipping.postcode || "",
          country: response.shipping.country || "",
        });

        setLoading(false);
      }
    };
    fetchInfo();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthToken(localStorage.getItem("token"));
    // console.log("Submitting info:", info);
    let payload = {};
    if( type === "billing" ) {
      payload = {
        billing: info
      }
    } else {
      payload = {
        shipping: info
      }
    }
    const response = await UserServices.updateCurrentUserInfo(payload);
    console.log("Response from update:", response);
    if (response.success) {
      toast.success(`Successfully updated ${type} information`);
      setLoading(false);
    } else {
      toast.error(`Failed to update ${type} information`);
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor={`${type}_address_1`} className="block text-sm font-medium text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            id={`${type}_address_1`}
            name={`${type}_address_1`}
            value={info.address_1}
            onChange={(e) =>
              setInfo({ ...info, address_1: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor={`${type}_address_2`} className="block text-sm font-medium text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            id={`${type}_address_2`}
            name={`${type}_address_2`}
            value={info.address_2}
            onChange={(e) =>
              setInfo({ ...info, address_2: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor={`${type}_city`} className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id={`${type}_city`}
            name={`${type}_city`}
            value={info.city}
            onChange={(e) =>
              setInfo({ ...info, city: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor={`${type}_state`} className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id={`${type}_state`}
            name={`${type}_state`}
            value={info.state}
            onChange={(e) =>
              setInfo({ ...info, state: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor={`${type}_postcode`} className="block text-sm font-medium text-gray-700">
            Postcode
          </label>
          <input
            type="text"
            id={`${type}_postcode`}
            name={`${type}_postcode`}
            value={info.postcode}
            onChange={(e) =>
              setInfo({ ...info, postcode: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor={`${type}_country`} className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            id={`${type}_country`}
            name={`${type}_country`}
            value={info.country}
            onChange={(e) =>
              setInfo({ ...info, country: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 cursor-pointer text-white bg-yellow-600 hover:bg-yellow-500 rounded-md shadow-md"
      >
        {loading ? "Processing..." : (`Save ${type.charAt(0).toUpperCase() + type.slice(1)} Info`)}
      </button>
    </form>
  );
};

export default BillingShippingInfo;