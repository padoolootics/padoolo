import React from 'react';
import InputField from './InputField';

interface UserAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  company: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  phone: string;
  email: string;
}

interface AddressFormProps {
  type: "billing" | "shipping";
  details: UserAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, type: "billing" | "shipping") => void;
  errors: Record<string, string>;
  title: string;
  icon?: React.ReactNode;
}

const AddressForm: React.FC<AddressFormProps> = ({
  type,
  details,
  onChange,
  errors,
  title,
  icon,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
        {icon}
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id={`${type}-first_name`}
          label="First name"
          name="first_name"
          value={details.first_name}
          onChange={(e) => onChange(e, type)}
          required
          error={errors[`${type === 'shipping' ? 'shipping_' : ''}first_name`]}
        />
        <InputField
          id={`${type}-last_name`}
          label="Last name"
          name="last_name"
          value={details.last_name}
          onChange={(e) => onChange(e, type)}
          required
          error={errors[`${type === 'shipping' ? 'shipping_' : ''}last_name`]}
        />
        <InputField
          id={`${type}-company`}
          label="Company"
          name="company"
          value={details.company}
          onChange={(e) => onChange(e, type)}
        />
        <InputField
          id={`${type}-address_1`}
          label="Street address"
          name="address_1"
          value={details.address_1}
          onChange={(e) => onChange(e, type)}
          required
          error={errors[`${type === 'shipping' ? 'shipping_' : ''}address_1`]}
          placeholder="House number and street name"
        />
        <InputField
          id={`${type}-address_2`}
          label="Apartment, suite, unit, etc. (optional)"
          name="address_2"
          value={details.address_2}
          onChange={(e) => onChange(e, type)}
        />
        <InputField
          id={`${type}-city`}
          label="Town / City"
          name="city"
          value={details.city}
          onChange={(e) => onChange(e, type)}
          required
          error={errors[`${type === 'shipping' ? 'shipping_' : ''}city`]}
        />
        <InputField
          id={`${type}-state`}
          label="State / County"
          name="state"
          value={details.state}
          onChange={(e) => onChange(e, type)}
        />
        <InputField
          id={`${type}-postcode`}
          label="Postcode / ZIP"
          name="postcode"
          value={details.postcode}
          onChange={(e) => onChange(e, type)}
          required
          error={errors[`${type === 'shipping' ? 'shipping_' : ''}postcode`]}
        />
        <InputField
          id={`${type}-country`}
          label="Country / Region"
          name="country"
          value={details.country}
          onChange={(e) => onChange(e, type)}
          required
          error={errors[`${type === 'shipping' ? 'shipping_' : ''}country`]}
        />
        {type === "billing" && (
          <>
            <InputField
              id="billing-phone"
              label="Phone"
              name="phone"
              value={details.phone}
              onChange={(e) => onChange(e, type)}
              required
              error={errors.phone}
            />
            <InputField
              id="billing-email"
              label="Email address"
              name="email"
              value={details.email}
              onChange={(e) => onChange(e, type)}
              required
              error={errors.email}
              type="email"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
