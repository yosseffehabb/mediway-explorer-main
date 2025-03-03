import React from "react";

interface ErrorPopUpProps {
  title?: string;
  message?: string;
  onClose: () => void;
}

const ErrorPopUp: React.FC<ErrorPopUpProps> = ({
  title = "Error",
  message = "Something went wrong!",
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:max-w-sm">
        <h2 className="mb-4 text-xl font-bold text-primary md:text-2xl">
          {title}
        </h2>
        <p className="mb-6 font-semibold text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="w-full rounded bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopUp;
