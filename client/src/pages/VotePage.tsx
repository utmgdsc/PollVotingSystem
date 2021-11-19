import React, { useState, useEffect } from "react";
import { PollOptionButton } from "../components/PollOptionButton";
import { Header } from "../components/Header";
import { io } from "socket.io-client";
import Cookies from "universal-cookie";
import { Redirect, useHistory } from "react-router-dom";
import { pollCodeCookie } from "../constants/constants";

export const VotePage = () => {
  const history = useHistory();
  const cookies = new Cookies();
  const [pollCode] = useState(cookies.get(pollCodeCookie));
  const [started, setStarted] = useState(false);
  const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, { withCredentials: true });
  const [errorCode, setErrorCode] = useState(0);
  const [selectedOption, setSelectionOption] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("join", pollCode);

      // on error go back to join page
      socket.on("error", (e) => {
        console.log("error");
        console.log(e.code);
        console.log(e.message);
        setErrorCode(e.code);
      });

      socket.on("pollStarted", (data) => {
        console.log("Poll Started", data);
        setStarted(data);
      });

      socket.on("end", (data) => {
        console.log(data);
        cookies.remove(pollCodeCookie);
        history.replace("/");
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [errorCode, started, selectedOption]);

  const pollButtonHandler = (selectedOption: string) => {
    console.log("Selected:", selectedOption);
    console.log((selectedOption.charCodeAt(0) % 65) + 1);
    socket.emit(
      "vote",
      (selectedOption.charCodeAt(0) % 65) + 1,
      "[STUDENT ID]"
    );
    setSelectionOption(selectedOption);
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
          disabled={!started}
        />
      );
    }
    return pollOptionButtons;
  };

  return errorCode === 1 ? (
    <Redirect to={"/"} />
  ) : (
    <div className={"flex flex-col items-center px-5"}>
      <Header text={`Poll Code: ${pollCode}`} />
      <Header text={`Selected Option: ${selectedOption}`} />
      <div className={"flex flex-col max-w-md"}>{optionButtons()}</div>
    </div>
  );
};
