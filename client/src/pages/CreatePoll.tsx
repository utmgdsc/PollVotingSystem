import React, { useState } from "react";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useHistory } from "react-router-dom";
import { instance } from "../axios";
import Cookies from "universal-cookie";
import { pollCodeCookie, pollIdCookie } from "../constants/constants";

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

  const cookie = new Cookies();
  const [pollConfig, updatePollConfig] = useState(initialState);
  const [requiredFieldError, setRequiredFieldError] = useState("");
  const [createPollError, setCreatePollError] = useState("");

  const pollOptions = {
    name: { fields: ["Poll Name", "Name"], required: false },
    description: {
      fields: ["Poll Description", "Description"],
      required: false,
    },
    courseCode: { fields: ["Course Code", "Course Code"], required: true },
  };

  const formOnChangeHandler = (a: string, pollOption: pollOption) => {
    const newPollConfig = { ...pollConfig };
    newPollConfig[pollOption] = a;
    updatePollConfig(newPollConfig);
  };

  const createPollHandler = () => {
    console.log("Submitting:", pollConfig);
    // Display something when creating a poll
    if (pollConfig.courseCode.length !== 0) {
      instance
        .post("/poll", pollConfig)
        .then((res) => {
          cookie.set(pollCodeCookie, res.data.pollCode, { path: "/" });
          cookie.set(pollIdCookie, res.data.pollId, { path: "/" });
          history.push("/votecontrols");
        })
        .catch((err) => {
          // Display error after
          setRequiredFieldError("");
          setCreatePollError("Unable to create poll");
          console.log(err);
        });
    } else {
      setCreatePollError("");
      setRequiredFieldError("Course Code is a required field");
    }
  };
  const pollInputs = (
    Object.keys(pollOptions) as Array<keyof typeof pollOptions>
  ).map((pollOption: pollOption, idx) => {
    const header = pollOptions[pollOption].fields[0];
    const placeholder = pollOptions[pollOption].fields[1];
    return (
      <FormInput
        key={idx}
        onChangeHandler={(e: string) => formOnChangeHandler(e, pollOption)}
        pollValue={pollConfig[pollOption]}
        header={header}
        placeholder={placeholder}
        required={pollOptions[pollOption].required}
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
      <div className={"text-center mb-4"}>
        <div className={"text-red-500"}>
          {requiredFieldError}
          {createPollError}
        </div>
        <div className={"text-center"}></div>
      </div>
      <Button value={"Create Poll"} onClick={() => createPollHandler()} />
    </div>
  );
};
