import React from 'react';

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  onApply: () => void;
  isLoading: boolean;
  appliedCoupons: any[];
}

const CouponSection: React.FC<CouponSectionProps> = ({
  couponCode,
  setCouponCode,
  onApply,
  isLoading,
  appliedCoupons,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Have a coupon?</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
        />
        <button
          onClick={onApply}
          disabled={isLoading || !couponCode}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            isLoading || !couponCode
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-black"
          }`}
        >
          {isLoading ? "..." : "Apply"}
        </button>
      </div>
      
      {appliedCoupons.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {appliedCoupons.map((c, i) => (
            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {c.code}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponSection;
