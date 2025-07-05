import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const AlertModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <FiAlertTriangle className="text-yellow-500 text-5xl mb-4" />
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <div className="text-gray-600 mt-2">
            {message.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
