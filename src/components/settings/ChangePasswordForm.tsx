'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Optional: lucide for icons

export default function ChangePasswordForm() {
  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: string) => {
    // setVisible(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-sm shadow-sm w-full">
      <h2 className="font-medium text-sm text-gray-700 border-b border-gray-300 p-4">CHANGE PASSWORD</h2>
      <div className="grid grid-cols-1 gap-6 text-sm p-4">
        {[
          { label: 'Current Password', name: 'currentPassword' },
          { label: 'New Password', name: 'newPassword', placeholder: '8+ characters' }, 
          { label: 'Confirm Password', name: 'confirmPassword' },
        ].map(({ label, name, placeholder }) => (
          <div className="relative" key={name}>
            <label className="block mb-1 text-gray-700">{label}</label>
            <input
              type={visible[name as keyof typeof visible] ? 'text' : 'password'}
              name={name}
              placeholder={placeholder}
              className="w-full border border-gray-300 px-3 py-3 rounded pr-10"
            />
            <span
              className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => toggleVisibility(name)}
            >
              {visible[name as keyof typeof visible] ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        ))}
        <div>
          <button
            type="button"
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-sm text-xs tracking-widest"
          >
            CHANGE PASSWORD
          </button>
        </div>
      </div>
    </div>
  );
}
