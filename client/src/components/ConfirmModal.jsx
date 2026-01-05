import React from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Are you sure?", message = "This action cannot be undone." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-sm rounded-xl shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col items-center text-center">
          <AiOutlineExclamationCircle className="text-red-500 text-4xl mb-3" />

          <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-6">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto"
            >
              Yes, Delete
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
