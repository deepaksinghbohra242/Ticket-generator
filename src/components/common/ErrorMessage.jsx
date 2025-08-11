import React from "react";

function ErrorMessage({ message, onGoBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">{message}</p>
        <button
          onClick={onGoBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;