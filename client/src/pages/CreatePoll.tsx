import React, { useState } from "react";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useHistory } from "react-router-dom";

interface NewPoll {
  name: string;
  description: string;
  courseCode: string;
}

type pollOption = "courseCode" | "name" | "description";

export const CreatePoll = () => {
  const initialState: NewPoll = {
    name: "",
    description: "",
    courseCode: "",
  };

  const [pollConfig, updatePollConfig] = useState(initialState);
  const pollOptions = {
    name: ["Poll Name", "Name"],
    description: ["Poll Description", "Description"],
    courseCode: ["Course Code", "Course Code"],
  };

  const handler = (a: string, pollOption: pollOption) => {
    const newPollConfig = { ...pollConfig };
    newPollConfig[pollOption] = a;
    console.log(newPollConfig);
    updatePollConfig(newPollConfig);
  };

  const pollInputs = (
    Object.keys(pollOptions) as Array<keyof typeof pollOptions>
  ).map((pollOption: pollOption, idx) => {
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

  const history = useHistory();
  return (
    <div className={"flex flex-col"}>
      <div className={"mb-14"}>
        <Header text={"Create Poll"} />
        {pollInputs}
      </div>
      <Button
        value={"Create Poll"}
        onClick={() => history.push("/votecontrols")}
      />
    </div>
  );
};
