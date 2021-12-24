import React from "react";

interface ButtonProps {
  value: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  value,
  onClick,
  className,
  disabled,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${className === undefined ? "" : className}
      ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-hover cursor-pointer"
      } px-32 py-2 inline-block bg-primary`}
    >
      <p className={"font-bold text-xl text-white text-center"}>{value}</p>
    </button>
  );
};
