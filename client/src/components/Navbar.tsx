import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { socket } from "../socket";
import {
  mcsPollVoting,
  pollIdCookie,
  voteControlsPath,
} from "../constants/constants";
import { instance } from "../axios";
import Cookies from "universal-cookie";

interface NavbarProps {
  options: Array<Option>;
}

export interface Option {
  name: string;
  href: string;
}

export const Navbar = ({ options }: NavbarProps) => {
  const cookies = new Cookies();
  const location = useLocation();
  const pollId = cookies.get(pollIdCookie);
  const [totalVotes, setTotalVotes] = useState(0);

  if (location.pathname === voteControlsPath) {
    document.title = `Votes: ${totalVotes}`;
  } else {
    document.title = mcsPollVoting;
  }

  const resultHandler = (res: any) => {
    const currentVotes = res.totalVotes;
    setTotalVotes(currentVotes);
  };

  socket.on("result", resultHandler);

  useEffect(() => {
    const fetchPollResults = async () => {
      if (pollId !== undefined) {
        await instance.get(`/poll/result?pollId=${pollId}`).then((res) => {
          setTotalVotes(res.data.totalVotes);
        });
      }
    };
    fetchPollResults();
  }, []);

  const history = useHistory();
  const optionLinks = options.map((option, idx) => {
    return (
      <li className={"text-center px-2"} key={idx}>
        <a
          className={"hover:text-headerHov text-sm mx-3"}
          href={option.href}
          onClick={(e) => {
            e.preventDefault();
            history.push(option.href);
          }}
        >
          {option.name}
        </a>
      </li>
    );
  });
  return (
    <div
      className={"w-auto flex text-center text-xl py-2 text-white bg-primary"}
    >
      <a className={"pl-3"} href={"/"}>
        MCS PollVoting
      </a>
      {location.pathname === voteControlsPath ? (
        <div className={"pl-5"}>Votes: {totalVotes}</div>
      ) : (
        <></>
      )}

      <ul className={"flex ml-auto"}>{optionLinks}</ul>
    </div>
  );
};
