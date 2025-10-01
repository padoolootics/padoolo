// FeedbackModal.tsx
import React from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-0">
        <div className="border-b border-gray-300 pb-3 mb-4 p-6">
          <h2 className="text-sm font-semibold text-gray-700">LEAVE FOR FEEDBACK</h2>
        </div>

        <div className="mb-4 px-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex items-center space-x-2">
            <div className="text-orange-400 text-lg">
              {'★★★★★'}
            </div>
            <span className="text-sm text-gray-600">5 Star Rating</span>
          </div>
        </div>

        <div className="mb-4 px-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
          <textarea
            rows={4}
            placeholder="Write down your feedback about our product & services"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          ></textarea>
        </div>

        <div className="mb-6 flex items-center mb-4 px-6">
            <button
                onClick={onClose}
                className="w-1/2 bg-yellow-600 hover:bg-yellow-500 text-white font-normal py-2 rounded-sm transition cursor-pointer"
            >
                PUBLISH REVIEW
            </button>
            <button
                onClick={onClose}
                className="ml-4 text-sm text-gray-500 hover:underline cursor-pointer"
            >
                Cancel
            </button>
        </div>

      </div>
    </div>
  );
}
