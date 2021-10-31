import React from "react";
import { Modal } from "../components/Modal";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PollCode } from "../components/PollCode";

export const VoteControls = () => {
  return (
    <>
      <Modal show={false} />
      <div className={"flex flex-col"}>
        <Header text={"[POLL NAME]"} />
        <Button value={"Start Poll"} className={"my-1"} />
        <Button value={"End Poll"} className={"my-1"} />
        <Button value={"End Poll"} className={"my-1"} />
        <Header text={"Poll Code"} />
        <PollCode code={"12345"} />
      </div>
    </>
  );
};
