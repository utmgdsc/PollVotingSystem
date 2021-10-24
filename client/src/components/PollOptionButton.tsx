import React from "react";

interface buttonType {
  name: string;
}

export const PollOptionButton = ({ name }: buttonType) => {
  return (
    <div
      className={
        "m-2 py-1 inline-block bg-primary hover:bg-hover cursor-pointer px-20 "
      }
    >
      <div className={"font-bold text-white"}>{name}</div>
    </div>
  );
};
