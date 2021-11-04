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
  const pollId = cookies.get(pollIdCookie);
  const [copyStatus, setCopyStatus] = useState("Copy Code");
  // const [connected, setConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [voteData, setVoteData] = useState([0, 0, 0, 0, 0]);
  const [pollStatus, setPollStatus] = useState({
    status: "Inactive",
    pollStarted: false,
  });

  if (pollCode === undefined) {
    history.replace("/");
  }
  const socket = io("http://localhost:3001", { withCredentials: true });

  useEffect(() => {
    const fetchPollStatus = async () => {
      await instance.get(`/poll/status?pollId=${pollId}`).then((res) => {
        // console.log(res.data.pollStarted);
        // console.log(pollStatus.pollStarted)
        // console.log("Old Status", res);
        const pollStarted = res.data.pollStarted;
        if (pollStarted !== pollStatus.pollStarted) {
          const newStatus = { ...pollStatus };
          newStatus.pollStarted = pollStarted;
          newStatus.status = pollStarted ? "Inactive" : "Active";
          setPollStatus(newStatus);
          // console.log("New Status", newStatus);
        } else {
          console.log(
            "Same, no update",
            pollStarted === pollStatus.pollStarted
          );
        }
      });
    };
    fetchPollStatus();

    const fetchPollResults = async () => {
      await instance.get(`/poll/result?pollId=${pollId}`).then((res) => {
        const pollResults = res.data.result;
        console.log("Old Poll Data", voteData);
        console.log(pollResults);
        let setData = false;
        const newVoteData = [...voteData];
        for (let i = 0; i < pollResults.length; i++) {
          if (pollResults[i].count !== voteData[pollResults[i]._id - 1]) {
            newVoteData[pollResults[i]._id - 1] = pollResults[i].count;
            setData = true;
          }
        }
        if (setData) {
          setVoteData(newVoteData);
          console.log("New Poll Data", newVoteData);
        }
      });
    };
    fetchPollResults();

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
  }, [pollStatus, voteData]);

  const pollControlHandler = (controlOption: string) => {
    switch (controlOption) {
      case "start":
        instance
          .patch(`/poll/${cookies.get(pollIdCookie)}`, { hasStarted: true })
          .then(() => setPollStatus({ status: "Active", pollStarted: true }))
          .catch(() => {
            setPollStatus({ ...pollStatus, status: "Unable to start poll" });
          });
        break;
      case "end":
        instance
          .patch(`/poll/${cookies.get(pollIdCookie)}`, { hasStarted: false })
          .then(() => setPollStatus({ status: "Inactive", pollStarted: false }))
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
            disabled={pollStatus.pollStarted}
          />
          <Button
            value={"End Poll"}
            className={"my-1"}
            onClick={() => pollControlHandler("end")}
            disabled={!pollStatus.pollStarted}
          />
          <Button
            onClick={() => setShowModal(true)}
            value={"View Results"}
            className={"my-1"}
            disabled={!pollStatus.pollStarted}
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
