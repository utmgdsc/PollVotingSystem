import React from "react";

interface ButtonProps {
  value: string;
  onClick?: React.MouseEventHandler;
}

export const Button = ({ value, onClick }: ButtonProps) => {
  return (
    <div
      className={
        "py-2 inline-block bg-primary hover:bg-hover cursor-pointer px-36"
      }
    >
      <p
        className={"font-bold text-xl text-white text-center"}
        onClick={() => onClick}
      >
        {value}
      </p>
    </div>
  );
};
