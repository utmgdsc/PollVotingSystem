import React from "react";

interface ModalProps {
  showModal: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Modal = ({ showModal, onClick, children }: ModalProps) => {
  return (
    <div
      className={`fixed ${
        showModal ? "" : "hidden"
      } inset-0 bg-gray-700 bg-opacity-100 overflow-y-auto h-full w-full`}
    >
      <div className={"flex h-full items-center justify-center"}>
        <div className={"w-4/12 bg-white"}>
          <div onClick={() => onClick()} className={"flex"}>
            <div
              className={
                "ml-auto p-2 text-xl hover:text-red-500 cursor-pointer"
              }
            >
              X
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
