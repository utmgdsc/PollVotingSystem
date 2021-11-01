import React, { useState } from "react";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { Header } from "../components/Header";
import { useHistory } from "react-router-dom";

export const JoinPoll = () => {
  const history = useHistory();
  const [pollCode, setPollCode] = useState("");

  const joinPollRoom = () => {
    console.log("Button was submitted");
    console.log(`Poll Code is: ${pollCode}`);
  };

  return (
    <div className={"border-4 border-green-600 block text-center px-5"}>
      <Header text={"MCS PollVoting"} />
      <div className={"flex flex-col"}>
        <FormInput
          placeholder={"Poll Code"}
          onChangeHandler={(e) => setPollCode(e)}
          pollValue={pollCode}
        />
        <Button value={"Enter"} onClick={() => history.push("/vote")} />
      </div>
    </div>
  );
};
