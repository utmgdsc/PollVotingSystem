import React from "react";
import { useHistory } from "react-router-dom";

interface NavbarProps {
  options: Array<Option>;
}

export interface Option {
  name: string;
  href: string;
}

export const Navbar = ({ options }: NavbarProps) => {
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
      <ul className={"flex ml-auto"}>{optionLinks}</ul>
    </div>
  );
};
