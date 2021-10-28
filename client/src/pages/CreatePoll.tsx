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
  numOptions: number;
}

export const CreatePoll = () => {
  const initialState: NewPoll = {
    name: "",
    description: "",
    courseCode: "",
    questions: [
      {
        question: "What's the runtime of the function?",
        numOptions: 5,
      },
      {
        question: "What is the distance from Earth to the Sun?",
        numOptions: 3,
      },
    ],
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

  const questionPreview = pollConfig.questions.map((question, idx) => {
    return <FormQuestion key={idx} question={question.question} />;
  });
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
      <div className={"mb-24"}>
        <Header text={"Create Poll"} />
        {pollInputs}
        Questions
        {questionPreview}
        <Button value={"Add Question"} secondary={true} />
      </div>
      <div className={"mt-50"}>
        <Button value={"Create Poll"} />
      </div>
    </div>
  );
};
