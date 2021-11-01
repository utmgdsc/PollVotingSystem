import React from "react";

interface buttonType {
  name: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const PollOptionButton = ({ name, onClick }: buttonType) => {
  return (
    <div
      onClick={onClick}
      className={
        "m-2 py-2 inline-block bg-primary hover:bg-hover cursor-pointer px-40"
      }
    >
      <div className={"text-xl font-bold text-white text-center"}>{name}</div>
    </div>
  );
};
