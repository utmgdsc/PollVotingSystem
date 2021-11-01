import React from "react";

interface ButtonProps {
  value: string;
  onClick?: React.MouseEventHandler;
  className?: string;
}

export const Button = ({ value, onClick, className }: ButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={`${className} py-2 inline-block bg-primary hover:bg-hover cursor-pointer px-36`}
    >
      <p className={"font-bold text-xl text-white text-center"}>{value}</p>
    </div>
  );
};
