import React, { useEffect, useState } from "react";
import { Modal } from "../components/Modal";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PollCode } from "../components/PollCode";
import Cookies from "universal-cookie";
import { instance } from "../axios";
import { pollIdCookie, pollCodeCookie } from "../constants/constants";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Chart } from "../components/Chart";
import { io } from "socket.io-client";
import { useHistory } from "react-router-dom";

interface Result {
  _id: number;
  count: number;
}

export const VoteControls = () => {
  const history = useHistory();
  const cookies = new Cookies();
  const pollCode = cookies.get(pollCodeCookie);
  const [copyStatus, setCopyStatus] = useState("Copy Code");
  // const [connected, setConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [voteData, setVoteData] = useState([0, 0, 0, 0, 0]);
  const [pollStatus, setPollStatus] = useState({
    status: "Active",
    disabled: true,
  });

  if (pollCode === undefined) {
    history.replace("/");
  }
  const socket = io("http://localhost:3001", { withCredentials: true });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("join", pollCode);
      //
      // // on error go back to join page
      // socket.on("error", () => {
      //   console.log("error");
      //   // setConnected(false);
      // });
      socket.on("result", (e: Result[]) => {
        console.log(e);
        const newVoteData = [...voteData];
        for (let i = 0; i < e.length; i++) {
          newVoteData[e[i]._id - 1] = e[i].count;
        }
        setVoteData(newVoteData);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

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
      {showModal ? (
        <Modal showModal={showModal} onClick={() => setShowModal(false)}>
          <Chart voteData={voteData} />
        </Modal>
      ) : (
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
            onClick={() => setShowModal(true)}
            value={"View Results"}
            className={"my-1"}
            disabled={pollStatus.disabled}
          />
          <Header text={"Poll Code"} />
          <PollCode code={pollCode} />
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
      )}
    </>
  );
};
