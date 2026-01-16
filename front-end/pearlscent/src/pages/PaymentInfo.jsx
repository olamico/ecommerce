import React from "react";
import { Link } from "react-router-dom";

const PaymentInfo = () => {
  const bankDetails = {
    bankName: "GTBank", // Change to your bank
    accountName: "Alozie Esther Chinomso",
    accountNumber: "0169411414", // Change to your number
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Bank Transfer Details
        </h2>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Bank Name
            </p>
            <p className="text-lg font-bold text-gray-800">
              {bankDetails.bankName}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Account Name
            </p>
            <p className="text-lg font-bold text-gray-800">
              {bankDetails.accountName}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg relative group">
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Account Number
            </p>
            <p className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
              {bankDetails.accountNumber}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Please send your proof of payment to our WhatsApp or Email after
            transfer.
          </p>
          <Link
            to="/"
            className="block w-full bg-pink-700 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
