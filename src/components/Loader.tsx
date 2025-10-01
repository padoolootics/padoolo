import React from "react";

export default function Loader () {
  return (
    <div className="flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-amber-500"></div>
    </div>
  );
};
