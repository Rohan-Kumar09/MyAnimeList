import React from "react";

const Settings = ({ onDeleteAccount }) => {
  return (
    <div className="settings-page flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Account Options</h2>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
          onClick={onDeleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
