import React from "react";

interface NavbarProps {
  options: Array<Option>;
}

export interface Option {
  name: string;
  href: string;
}

export const Navbar = ({ options }: NavbarProps) => {
  const optionLinks = options.map((option, idx) => {
    return (
      <li className={"px-2"} key={idx}>
        <a className={"text-sm mx-3"} href={option.href}>
          {option.name}
        </a>
      </li>
    );
  });
  return (
    <nav className={"text-xl px-2 py-2 text-white bg-primary flex"}>
      <a href={"/"}>MCS PollVoting</a>
      <ul className={"flex ml-auto"}>{optionLinks}</ul>
    </nav>
  );
};
