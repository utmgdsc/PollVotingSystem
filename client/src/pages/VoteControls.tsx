import React, { useState } from "react";
import { Modal } from "../components/Modal";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PollCode } from "../components/PollCode";
import Cookies from "universal-cookie";
import { instance } from "../axios";
import { pollIdCookie, pollCodeCookie } from "../constants/constants";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const VoteControls = () => {
  const [copyStatus, setCopyStatus] = useState("Copy Code");
  const [pollStatus, setPollStatus] = useState({
    status: "Active",
    disabled: true,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const cookies = new Cookies();
  const pollControlHandler = (controlOption: string) => {
    switch (controlOption) {
      case "start":
        instance
          .patch(`/poll/${cookies.get(pollIdCookie)}`, { hasStarted: true })
          .then(() => setPollStatus({ status: "Active", disabled: false }))
          .catch(() => {
            setPollStatus({ ...pollStatus, status: "Unable to start poll" });
          });
        break;
      case "end":
        instance
          .patch(`/poll/${cookies.get(pollIdCookie)}`, { hasStarted: false })
          .then(() => setPollStatus({ status: "Inactive", disabled: true }))
          .catch(() => {
            setPollStatus({ ...pollStatus, status: "Unable to end poll" });
          });
        break;
    }
  };

  return (
    <>
      <Modal show={false} />
      <div className={"flex flex-col"}>
        <Header text={"Poll Controls"} />
        <div className={"text-xl"}>Poll Status: {pollStatus.status}</div>
        <Button
          value={"Start Poll"}
          className={"my-1"}
          onClick={() => pollControlHandler("start")}
          disabled={!pollStatus.disabled}
        />
        <Button
          value={"End Poll"}
          className={"my-1"}
          onClick={() => pollControlHandler("end")}
          disabled={pollStatus.disabled}
        />
        <Button
          value={"View Results"}
          className={"my-1"}
          disabled={pollStatus.disabled}
        />
        <Header text={"Poll Code"} />
        <PollCode code={cookies.get(pollCodeCookie)} />
        <CopyToClipboard
          text={cookies.get(pollCodeCookie)}
          onCopy={() => {
            setCopyStatus("Copied!");
            setTimeout(() => {
              setCopyStatus("Copy Code");
            }, 2000);
          }}
        >
          <Button value={copyStatus} />
        </CopyToClipboard>
      </div>
    </>
  );
};
