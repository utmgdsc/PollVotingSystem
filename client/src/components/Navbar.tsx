import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { socket } from "../socket";
import { voteControlsPath } from "../constants/constants";

interface NavbarProps {
  options: Array<Option>;
}

export interface Option {
  name: string;
  href: string;
}

export const Navbar = ({ options }: NavbarProps) => {
  const location = useLocation();
  const [totalVotes, setTotalVotes] = useState(0);
  const resultHandler = (res: []) => {
    setTotalVotes(res.length);
  };
  socket.on("result", resultHandler);

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
