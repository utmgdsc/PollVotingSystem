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
  const hi = "hi";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-hover cursor-pointer"
      } py-2 inline-block bg-primary px-36`}
    >
      <p className={"font-bold text-xl text-white text-center"}>{value}</p>
    </button>
  );
};
