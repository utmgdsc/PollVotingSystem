import React from "react";
import { PollOptionButton } from "../components/PollOptionButton";
import { Header } from "../components/Header";

export const VotePage = () => {
  const pollButtonHandler = (selectedOption: string) => {
    console.log("Selected:", selectedOption);
  };

  const optionButtons = () => {
    const pollOptionButtons = [];
    for (let i = 65; i < 70; i++) {
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
      <div className={"flex flex-col max-w-md"}>{optionButtons()}</div>
    </div>
  );
};
