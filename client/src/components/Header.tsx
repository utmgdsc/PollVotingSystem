import React from "react";

interface HeaderProps {
  text: string;
  primary?: boolean;
}

export const Header = ({ text, primary }: HeaderProps) => {
  return (
    <div
      className={`${primary ? "text-3xl" : "text-2xl"} text-center py-2 my-3`}
    >
      {text}
    </div>
  );
};
