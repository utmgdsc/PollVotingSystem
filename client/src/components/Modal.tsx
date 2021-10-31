import React from "react";

interface ModalProps {
  show: boolean;
}

export const Modal = ({ show }: ModalProps) => {
  return (
    <div
      className={`fixed ${
        show ? "" : "hidden"
      } inset-0 bg-gray-500 bg-opacity-80 overflow-y-auto h-full w-full`}
    >
      Modal
    </div>
  );
};
