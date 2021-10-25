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
    <div className={"flex items-center flex-col px-5"}>
      <p className={"text-center text-3xl mt-4 mb-12"}>Poll Name</p>
      <div className={"max-w-xl"}>
        <p className={"text-2xl mb-5 text-center my-5"}>{question}</p>
      </div>
      <div className={"flex flex-col max-w-md"}>{optionButtons()}</div>
    </div>
  );
};
