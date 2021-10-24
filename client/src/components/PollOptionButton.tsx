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
        "m-2 py-1 inline-block bg-primary hover:bg-hover cursor-pointer px-36"
      }
    >
      <div className={"font-bold text-white"}>{name}</div>
    </div>
  );
};
