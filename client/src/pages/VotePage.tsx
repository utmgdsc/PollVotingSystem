import React, { useState, useEffect } from "react";
import { PollOptionButton } from "../components/PollOptionButton";
import { Header } from "../components/Header";
import Cookies from "universal-cookie";
import { Redirect, useHistory } from "react-router-dom";
import {
  mcsPollVoting,
  pollCodeCookie,
  questionStarted,
} from "../constants/constants";
import { socket } from "../socket";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

export const VotePage = () => {
  const history = useHistory();
  const cookies = new Cookies();
  const [pollCode] = useState(cookies.get(pollCodeCookie));
  const [started, setStarted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [timeOutError, setTimeOutError] = useState(false);
  const [timeOutCode, setTimeOutCode] = useState(0);

  const [errorCode, setErrorCode] = useState(0);
  const [selectedOption, setSelectionOption] = useState("");
  const [isFocus, setFocus] = useState(true);

  const onBlur = () => {
    setFocus(false);
  };

  const onFocus = () => {
    document.title = mcsPollVoting;
    setFocus(true);
  };

  useEffect(() => {
    socket.emit("join", pollCode);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const errorHandler = (e: any) => {
      setErrorCode(e.code);
    };

    // on error go back to join page
    socket.on("error", errorHandler);

    const pollStartedHandler = (data: any) => {
      setStarted(data);
      if (data) {
        const audio = new Audio("/newQuestion.wav");
        audio.play();
        setSelectionOption("");
        if (!isFocus) {
          document.title = questionStarted;
        }
      }
    };

    socket.on("pollStarted", pollStartedHandler);

    const pollClosedHandler = (data: any) => {
      cookies.remove(pollCodeCookie);
      history.replace("/");
    };
    socket.on("end", pollClosedHandler);

    const voteAckHandler = (data: any) => {
      setSelectionOption(String.fromCharCode(data + 64));
      clearTimeout(timeOutCode);
      setTimeOutError(false);
      setLoading(false);
    };
    socket.on("ack", voteAckHandler);

    return () => {
      socket.off("error", errorHandler);
      socket.off("pollStarted", pollStartedHandler);
      socket.off("end", pollClosedHandler);
      socket.off("ack", voteAckHandler);
    };
  }, [errorCode, started, selectedOption]);

  const pollButtonHandler = (selectedOption: string) => {
    setLoading(true);
    setTimeOutCode(
      setTimeout(() => {
        setTimeOutError(true);
        setLoading(false);
      }, 10000) as unknown as number
    );
    socket.emit("vote", (selectedOption.charCodeAt(0) % 65) + 1);
  };

  const handleErrorClose = (
    e: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setTimeOutError(false);
  };
  const optionButtons = () => {
    const pollOptionButtons = [];
    for (let i = 65; i < 70; i++) {
      const optionValue = String.fromCharCode(i);
      pollOptionButtons.push(
        <PollOptionButton
          selected={selectedOption === optionValue}
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
      <div className={"relative"}>
        <div className={"flex flex-col max-w-md"}>{optionButtons()}</div>
        {loading ? (
          <div className={"z-50 top-0 left-0 block w-full h-full absolute "}>
            <div
              className={
                "flex items-center w-full bg- h-full flex-col justify-center align-middle"
              }
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <CircularProgress
                size={70}
                sx={{
                  color: "white",
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
      <Snackbar
        open={timeOutError}
        onClose={handleErrorClose}
        autoHideDuration={6000}
      >
        <Alert
          severity="error"
          onClose={handleErrorClose}
          sx={{ width: "100%" }}
        >
          Vote not received, please try again!
        </Alert>
      </Snackbar>
    </div>
  );
};
