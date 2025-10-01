import { ToastContainer } from "react-toastify";
import AccountInfo from "./AccountInfo";
import BillingShippingInfo from "./BillingShippingInfo";
import ChangePassword from "./ChangePassword";

const Settings: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto p-6 space-y-12 bg-white shadow-md rounded-lg">
        {/* <h2 className="text-2xl mb-4 font-medium text-gray-900">Settings</h2> */}

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Account Info
          </h2>
          <AccountInfo />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Billing & Shipping Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="border border-gray-200 rounded-lg p-6">
              <BillingShippingInfo type="billing" />
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <BillingShippingInfo type="shipping" />
            </div>
          </div>
          <h2 className="text-xl font-medium text-gray-800 my-4">
            Change Password
          </h2>
          <div className="border border-gray-200 rounded-lg p-6">
            <ChangePassword />
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
    </>
  );
};

export default Settings;

// "use client";

// import { useEffect, useState } from "react";
// import AccountInfoForm from "@/components/settings/AccountInfoForm";
// import AddressSection from "@/components/settings/AddressSection";
// import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
// import { setAuthToken } from "@/lib/api/services/httpServices";
// import UserServices from "@/lib/api/services/UserServices";

// export default function Settings() {
//   const [formData, setFormData] = useState<any>({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true);
//       try {
//         // Get current user info from the API
//         setAuthToken(localStorage.getItem("token"));
//         const userInfo = await UserServices.getCurrentUserInfo();
//         setFormData(userInfo);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         // setIsError(true);
//         // setMessage("Failed to load user data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // console.log("Form Data----->--@:", formData);

//   const handleAddressChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//     section: "billing" | "shipping"
//   ) => {
//     const { name, value } = e.target;
//     const updater = section === "billing" ? formData.billing : formData.shipping;
//     updater((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//   };

//   return (
//     <div onSubmit={handleSubmit} className="space-y-8">
//       <AccountInfoForm formData={formData} setFormData={setFormData} />
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* <AddressSection
//           title="BILLING ADDRESS"
//           section="billing"
//           data={formData.billing || {}}
//           onChange={handleAddressChange}
//         /> */}
//         {/* <AddressSection
//           title="SHIPPING ADDRESS"
//           section="shipping"
//           data={formData.shipping || {}}
//           onChange={handleAddressChange}
//         /> */}
//       </div>
//       <ChangePasswordForm />
//     </div>
//   );
// }
