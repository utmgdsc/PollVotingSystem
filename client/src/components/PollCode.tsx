import React from "react";
import { PollCodeSegment } from "./PollCodeSegment";

interface PollCodeInterface {
  code: string;
}

export const PollCode = ({ code }: PollCodeInterface) => {
  const pollCodeSegments = () => {
    const segments = [];
    for (let i = 0; i < code.toString().length; i++) {
      segments.push(<PollCodeSegment key={i} value={code[i]} />);
    }
    return segments;
  };
  return <div className={"flex justify-center"}>{pollCodeSegments()}</div>;
};
