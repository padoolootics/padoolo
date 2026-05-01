import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  error,
  placeholder,
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default InputField;
