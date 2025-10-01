'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import UserServices from '@/lib/api/services/UserServices';

export default function AccountInfoForm({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  // A ref to access the file input element and its selected file
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Local state to manage the UI feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // A helper to determine if the avatar is a local file
  const isLocalImage = formData.isLocal;

  /**
   * Handles changes in text input fields and updates the form state.
   * @param {React.ChangeEvent<HTMLInputElement>} e The event object.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the avatar file selection and updates the state for preview.
   * This function also sets `isLocal` to true to use the local preview.
   * @param {React.ChangeEvent<HTMLInputElement>} e The event object.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev: any) => ({
        ...prev,
        avatar: imageUrl,
        isLocal: true,
      }));
    }
  };

  /**
   * Submits the form data to the UserServices.updateUserInfo method.
   * This function creates a FormData object to handle both text and file data.
   * @param {React.FormEvent<HTMLFormElement>} e The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // Create the form data object
      const userInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber, // Map the phone number correctly
        avatar: fileInputRef.current?.files?.[0], // Attach the avatar file if selected
      };

      // Call the UserService to update user info
      const response = await UserServices.updateUserInfo(0, userInfo); // 0 or actual user id here

      if (response && response.message) {
        setMessage(response.message);
        // Optionally, update the formData with the new avatar URL if it was returned
        if (response.avatarUrl) {
          setFormData((prev: any) => ({
            ...prev,
            avatar: response.avatarUrl,
            isLocal: false,
          }));
        }
      }
    } catch (error) {
      setIsError(true);
      setMessage('An error occurred while updating your account. Please try again.');
      console.error('Update Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full mx-auto bg-white border border-gray-200 rounded-sm shadow-sm">
        <h2 className="font-medium text-sm text-gray-700 mb-6 border-b border-gray-300 p-4">
          ACCOUNT SETTING
        </h2>
        <div className="flex flex-col md:flex-row gap-8 p-4">
          <div className="flex flex-col items-center md:block space-y-2">
            <div className="w-28 h-28 relative rounded-full overflow-hidden">
              {isLocalImage ? (
                <Image
                  src={formData.avatar || '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-28 h-28 object-cover rounded-full"
                  width={112}
                  height={112}
                />
              ) : (
                <Image
                  src={formData.avatar || '/default-avatar.png'}
                  alt="User Avatar"
                  width={112}
                  height={112}
                  className="object-cover rounded-full"
                />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="text-sm text-black hover:text-yellow-500 cursor-pointer"
            >
              Change Avatar
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            {[{
              label: 'First Name', name: 'firstName', placeholder: 'Enter your first name',
            }, {
              label: 'Last Name', name: 'lastName', placeholder: 'Enter your last name',
            }, {
              label: 'Email', name: 'email', placeholder: 'Enter your email',
            }, {
              label: 'Phone Number', name: 'phoneNumber', placeholder: 'Enter your phone number',
            }].map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-gray-700">{label}</label>
                <input
                  type="text"
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-3"
                />
              </div>
            ))}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-1/4 bg-yellow-600 hover:bg-yellow-500 text-white font-normal p-3 rounded-sm transition cursor-pointer disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              {message && (
                <div className={`mt-2 text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}