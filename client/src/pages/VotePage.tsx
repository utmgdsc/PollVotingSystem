import React from "react";
import { PollOptionButton } from "../components/PollOptionButton";

interface VotePageParams {
  question: string;
  options: number;
}

export const VotePage = ({ question, options }: VotePageParams) => {
  const pollButtonHandler = (selectedOption: string) => {
    console.log("Selected:", selectedOption);
  };

  const optionButtons = () => {
    const pollOptionButtons = [];
    for (let i = 65; i < 65 + options; i++) {
      const optionValue = String.fromCharCode(i);
      pollOptionButtons.push(
        <PollOptionButton
          key={i}
          onClick={() => pollButtonHandler(optionValue)}
          name={optionValue}
        />
      );
    }
    return pollOptionButtons;
  };

  return (
    <div className={"inline-flex flex-col px-5"}>
      <h1 className={"text-center my-5"}>{question}</h1>
      <div className={"flex flex-col"}>{optionButtons()}</div>
    </div>
  );
};
