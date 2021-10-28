import React from "react";
import { PollOptionButton } from "../components/PollOptionButton";
import { Header } from "../components/Header";

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
    <div className={"flex flex-col items-center px-5"}>
      <Header text={"Poll Name"} />
      <div className={"max-w-xl"}>
        <Header text={question} secondary={true} />
      </div>
      <div className={"flex flex-col max-w-md"}>{optionButtons()}</div>
    </div>
  );
};
