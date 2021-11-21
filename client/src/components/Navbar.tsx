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
      <li className={"px-2"} key={idx}>
        <a
          className={"text-sm mx-3"}
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
    <div className={"w-auto flex text-xl px-2 py-2 text-white bg-primary"}>
      <a href={"/"}>MCS PollVoting</a>
      <ul className={"flex ml-auto"}>{optionLinks}</ul>
    </div>
  );
};
