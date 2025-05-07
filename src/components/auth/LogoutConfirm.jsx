// src/components/auth/LogoutConfirm.jsx
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";

export default function LogoutConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Logout</button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white rounded-lg shadow-xl">
            <Dialog.Title className="text-lg font-medium">
              Confirm Logout
            </Dialog.Title>
            <div className="mt-4">
              <p>Are you sure you want to logout?</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
