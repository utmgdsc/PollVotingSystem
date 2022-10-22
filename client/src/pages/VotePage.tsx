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
import { ErrorAlert } from "../components/ErrorAlert";

export const VotePage = () => {
  const history = useHistory();
  const cookies = new Cookies();
  const [pollCode] = useState(cookies.get(pollCodeCookie));
  const [started, setStarted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [timeoutCode, setTimeoutCode] = useState(0);
  const [timeoutError, setTimeoutError] = useState(false);

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
      clearTimeout(timeoutCode);
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
    setTimeoutCode(
      setTimeout(() => {
        triggerTimeOutError();
        setLoading(false);
      }, 10000) as unknown as number
    );
    socket.emit("vote", (selectedOption.charCodeAt(0) % 65) + 1);
  };
  const triggerTimeOutError = () => {
    setTimeoutError(true);
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
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-900 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="white"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#00204E"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <ErrorAlert
        text={"Your vote was not received, please try again."}
        title={"Vote not received!"}
        enabled={timeoutError}
        onClose={() => {
          setTimeoutError(false);
        }}
      />
    </div>
  );
};
