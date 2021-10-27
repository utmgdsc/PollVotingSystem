import React, { useState } from "react";
import { PollInput } from "../components/PollInput";

interface NewPoll {
  name: string;
  description: string;
  courseCode: string;
  questions: PollQuestion[];
}

interface PollQuestion {
  question: string;
  pollOptions: number;
}

export const CreatePoll = () => {
  const initialState: NewPoll = {
    name: "",
    description: "",
    courseCode: "",
    questions: [],
  };
  const [pollConfig, updatePollConfig] = useState(initialState);
  const pollOptions = [
    ["Poll Code", "Name"],
    ["Poll Description", "Description"],
    ["Course Code", "Course Code"],
  ];

  const handler = (a: string, b: string) => {
    const newPollConfig = { ...pollConfig };
    console.log(newPollConfig);
    updatePollConfig(newPollConfig);
  };

  const pollInputs = pollOptions.map((pollOption, idx) => {
    return (
      <PollInput
        key={idx}
        onChangeHandler={(e: string) => handler(e, pollOption[1].toLowerCase())}
        pollValue={pollConfig.name}
        inputHeader={pollOption[0]}
        placeholder={pollOption[1]}
      />
    );
  });

  return <div className={"flex flex-col"}>{pollInputs}</div>;
};
