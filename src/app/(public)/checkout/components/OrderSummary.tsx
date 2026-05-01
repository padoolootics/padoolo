import React from 'react';
import Image from 'next/image';
import { CartTotalResponse } from '@/lib/api/services/CartServices';
import { formatPrice } from '@/lib/utils/currency';

interface OrderSummaryProps {
  cartData: CartTotalResponse | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartData }) => {
  if (!cartData) return null;

  const symbol = cartData.currency.symbol;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {cartData.items.map((item, index) => (
          <div key={index} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h4>
              <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.price, symbol)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(cartData.subtotal, symbol)}</span>
        </div>
        
        {cartData.coupons.map((coupon, idx) => (
          <div key={idx} className="flex justify-between text-green-600 text-sm">
            <span>Coupon ({coupon.code})</span>
            <span>-{formatPrice(coupon.discount, symbol)}</span>
          </div>
        ))}

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>
            {parseFloat(cartData.shipping.total) === 0 
              ? 'Free' 
              : formatPrice(cartData.shipping.total, symbol)}
          </span>
        </div>

        {parseFloat(cartData.total_tax) > 0 && (
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Tax</span>
            <span>{formatPrice(cartData.total_tax, symbol)}</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-100 pt-4 mt-2">
          <span>Total</span>
          <span>{formatPrice(cartData.total, symbol)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
