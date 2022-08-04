import React, { useState } from "react";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useHistory } from "react-router-dom";
import { instance } from "../axios";
import Cookies from "universal-cookie";
import {
  pollCodeCookie,
  pollCreateLoadingStatus,
  pollIdCookie,
} from "../constants/constants";
import { Modal } from "../components/Modal";

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
  const history = useHistory();
  const cookies = new Cookies();
  const [pollConfig, updatePollConfig] = useState(initialState);
  const [requiredFieldError, setRequiredFieldError] = useState("");
  const [createPollStatus, setCreatePollStatus] = useState("");
  const [_, setShowModal] = useState(true);
  const pollId = cookies.get(pollIdCookie);
  const pollCode = cookies.get(pollCodeCookie);

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
    // Display something when creating a poll
    setRequiredFieldError("");
    setCreatePollStatus(pollCreateLoadingStatus);
    if (pollConfig.courseCode.length !== 0) {
      instance
        .post("/poll", pollConfig)
        .then((res) => {
          cookies.set(pollCodeCookie, res.data.pollCode, { path: "/" });
          cookies.set(pollIdCookie, res.data.pollId, { path: "/" });
          history.push("/votecontrols");
        })
        .catch(() => {
          // Display error after
          setRequiredFieldError("");
          setCreatePollStatus("Unable to create poll");
          // console.error(err);
        });
    } else {
      setCreatePollStatus("");
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

  const checkPreviousActivePolls = () => {
    return pollId !== undefined && pollCode !== undefined;
  };

  const disconnectAllStudents = () => {
    instance.patch(`/poll/end/${pollCode}`).catch(() => {
      // console.error(e);
    });
  };

  return (
    <>
      <Modal
        showModal={checkPreviousActivePolls()}
        onClick={() => {
          cookies.remove(pollIdCookie);
          cookies.remove(pollCodeCookie);
          disconnectAllStudents();
          setShowModal(false);
        }}
      >
        <div className={"text-center mb-10 mx-2"}>
          Note: Any current active polls will be stopped
        </div>
      </Modal>
      <div className={"flex flex-col"}>
        <div className={"mb-14"}>
          <Header text={"Create Poll"} />
          {pollInputs}
        </div>
        <div className={"text-center mb-4"}>
          <div
            className={`${
              createPollStatus === pollCreateLoadingStatus
                ? "text-black"
                : "text-red-500"
            }`}
          >
            {requiredFieldError}
            {createPollStatus}
          </div>
        </div>
        <Button value={"Create Poll"} onClick={() => createPollHandler()} />
      </div>
    </>
  );
};
