import React from "react";

interface PollCodeProps {
  value: string;
}

export const PollCodeSegment = ({ value }: PollCodeProps) => {
  return (
    <div
      className={
        "flex mx-3 bg-primary text-white text-2xl h-12 w-12 items-center justify-center"
      }
    >
      {value}
    </div>
  );
};
