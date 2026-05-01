import React from 'react';

interface PaymentGateway {
  id: string;
  title: string;
  description: string;
}

interface PaymentMethodSelectorProps {
  gateways: PaymentGateway[];
  selectedMethod: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  gateways,
  selectedMethod,
  onSelect,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="space-y-3 hidden">
      {gateways.map((gateway) => (
        <label
          key={gateway.id}
          className={`flex items-start p-4 border rounded-xl cursor-pointer transition ${selectedMethod === gateway.id
              ? "border-yellow-500 bg-yellow-50/30"
              : "border-gray-200 hover:border-gray-300"
            }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={gateway.id}
            checked={selectedMethod === gateway.id}
            onChange={() => onSelect(gateway.id)}
            className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
          />
          <div className="ml-3">
            <span className="block text-sm font-semibold text-gray-900">
              {gateway.title}
            </span>
            <span className="block text-xs text-gray-500 mt-1"
              dangerouslySetInnerHTML={{ __html: gateway.description }}>
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
