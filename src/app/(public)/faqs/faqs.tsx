'use client'

import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"; // Import icons

// Define types for the FAQ data
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Toggle FAQ answer visibility
  const toggleAnswer = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null); // If it's already open, close it
    } else {
      setActiveIndex(index); // Open the clicked FAQ
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-0 py-8">
      {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2> */}

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleAnswer(index)}
              className="w-full text-left text-lg font-medium cursor-pointer text-gray-900 hover:text-yellow-600 focus:outline-none flex items-center justify-between"
            >
              <span>{faq.question}</span>
              {/* Icon: Show ChevronDown if the answer is hidden, ChevronUp if visible */}
              {activeIndex === index ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {activeIndex === index && (
              <div
                className="mt-2 text-gray-700"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;