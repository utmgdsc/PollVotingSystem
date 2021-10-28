import React, { useState } from "react";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { FormQuestion } from "../components/FormQuestion";

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
  const pollOptions = {
    name: ["Poll Name", "Name"],
    description: ["Poll Description", "Description"],
    courseCode: ["Course Code", "Course Code"],
  };

  const handler = (
    a: string,
    pollOption: "courseCode" | "name" | "description"
  ) => {
    const newPollConfig = { ...pollConfig };
    newPollConfig[pollOption] = a;
    console.log(newPollConfig);
    updatePollConfig(newPollConfig);
  };

  const pollInputs = (
    Object.keys(pollOptions) as Array<keyof typeof pollOptions>
  ).map((pollOption, idx) => {
    const header = pollOptions[pollOption][0];
    const placeholder = pollOptions[pollOption][1];
    return (
      <FormInput
        key={idx}
        onChangeHandler={(e: string) => handler(e, pollOption)}
        pollValue={pollConfig[pollOption]}
        header={header}
        placeholder={placeholder}
      />
    );
  });

  return (
    <div className={"flex flex-col"}>
      <Header text={"Create Poll"} />
      {pollInputs}
      <FormQuestion question={"What's the runtime of the function?"} />
      <Button value={"Add Question"} secondary={true} />
      <Button value={"Create Poll"} />
    </div>
  );
};
