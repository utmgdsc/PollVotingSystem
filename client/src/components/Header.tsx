import React from "react";

interface HeaderProps {
  secondary?: boolean;
  text: string;
}

export const Header = ({ text, secondary }: HeaderProps) => {
  return (
    <div
      className={`${secondary ? "text-xl" : "text-3xl"} text-center py-2 my-3`}
    >
      {text}
    </div>
  );
};
