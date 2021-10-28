import React from "react";

interface ButtonProps {
  value: string;
  secondary?: boolean;
  onClick?: React.MouseEventHandler;
}

export const Button = ({ value, secondary, onClick }: ButtonProps) => {
  return (
    <div
      className={
        "py-2 inline-block bg-primary hover:bg-hover cursor-pointer px-36"
      }
    >
      <p
        className={`${
          secondary ? "" : "font-bold text-xl"
        } text-white text-center`}
        onClick={() => onClick}
      >
        {value}
      </p>
    </div>
  );
};
