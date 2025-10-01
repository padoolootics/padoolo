import React, { ButtonHTMLAttributes } from 'react';

interface ButtonSecondaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  className = '',
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`ttnc-ButtonSecondary bg-yellow-600 px-4 placeholder-yellow-300 hover:bg-yellow-600 hover:text-gray-100 cursor-pointer text-white rounded-full    ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;