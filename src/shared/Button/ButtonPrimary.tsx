import React, { ButtonHTMLAttributes } from 'react';

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = '',
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`ttnc-ButtonPrimary px-4 py-3 rounded-full border border-gray-300 bg-white hover:bg-yellow-600 hover:text-gray-100 cursor-pointer text-gray-800  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;