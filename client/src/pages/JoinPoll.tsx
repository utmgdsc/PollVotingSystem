import React, { useState } from "react";

export const JoinPoll = () => {
  const [pollCode, setPollCode] = useState("");

  const joinPollRoom = () => {
    console.log("Button was submitted");
    console.log(`Poll Code is: ${pollCode}`);
  };

  return (
    <div className={"block text-center mt-96 px-5"}>
      <p className={"text-2xl py-2 my-3 font-medium"}>MCS PollVoting</p>
      <div className={"flex flex-col"}>
        <input
          className={
            "focus:outline-none text-center border border-black py-2 px-20"
          }
          type={"text"}
          placeholder={"Poll Code"}
          value={pollCode}
          onChange={(e) => setPollCode(e.target.value)}
        />
        <div
          className={
            "py-2 inline-block bg-primary hover:bg-hover cursor-pointer px-36"
          }
        >
          <p
            className={"text-xl font-bold text-white text-center"}
            onClick={() => joinPollRoom()}
          >
            Enter
          </p>
        </div>
      </div>
    </div>
  );
};
