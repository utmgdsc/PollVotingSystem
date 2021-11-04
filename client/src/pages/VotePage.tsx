import React, { useState, useEffect } from "react";
import { PollOptionButton } from "../components/PollOptionButton";
import { Header } from "../components/Header";
import { io } from "socket.io-client";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import { pollCodeCookie } from "../constants/constants";

export const VotePage = () => {
  const history = useHistory();
  const cookies = new Cookies();
  const [pollCode] = useState(cookies.get(pollCodeCookie));
  const [connected, setConnected] = useState(true);
  const [started, setStarted] = useState(false);
  const socket = io("http://localhost:3001", { withCredentials: true });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("join", pollCode);

      // on error go back to join page
      socket.on("error", (e) => {
        // console.log("error");
        // setConnected(false);
        socket.disconnect();
      });
      // socket.on("pollStarted", (data) => {
      //   console.log(data);
      //   setStarted(data);
      // });
      // socket.on("result", console.log);
    });

    if (!connected) {
      socket.disconnect();
      // history.push("/");
    }
  }, [socket]);

  const pollButtonHandler = (selectedOption: string) => {
    console.log("Selected:", selectedOption);
    console.log((selectedOption.charCodeAt(0) % 65) + 1);
    socket.emit(
      "vote",
      (selectedOption.charCodeAt(0) % 65) + 1,
      "[STUDENT ID]"
    );
  };

  const optionButtons = () => {
    const pollOptionButtons = [];
    for (let i = 65; i < 70; i++) {
      const optionValue = String.fromCharCode(i);
      pollOptionButtons.push(
        <PollOptionButton
          key={i}
          onClick={() => pollButtonHandler(optionValue)}
          name={optionValue}
        />
      );
    }
    return pollOptionButtons;
  };

  return (
    <div className={"flex flex-col items-center px-5"}>
      <Header text={`Poll Code: ${pollCode}`} />
      <div className={"flex flex-col max-w-md"}>{optionButtons()}</div>
    </div>
  );
};
