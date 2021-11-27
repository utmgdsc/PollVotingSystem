import React from "react";

interface HeaderProps {
  text: string;
  primary?: boolean;
}

export const Header = ({ text, primary }: HeaderProps) => {
  return (
    <div
      className={`${primary ? "text-2xl" : "text-xl"} text-center py-2 my-3`}
    >
      {text}
    </div>
  );
};
