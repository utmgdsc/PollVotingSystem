import React, { useState } from "react";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { Header } from "../components/Header";

export const JoinPoll = () => {
  const [pollCode, setPollCode] = useState("");

  const joinPollRoom = () => {
    console.log("Button was submitted");
    console.log(`Poll Code is: ${pollCode}`);
  };

  return (
    <div className={"block text-center mt-96 px-5"}>
      <Header text={"MCS PollVoting"} />
      <div className={"flex flex-col"}>
        <FormInput
          placeholder={"Poll Code"}
          onChangeHandler={(e) => setPollCode(e)}
          pollValue={pollCode}
        />
        <Button value={"Enter"} />
      </div>
    </div>
  );
};
