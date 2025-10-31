import React from "react";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700 p-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
        />
      </svg>
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default Error;
