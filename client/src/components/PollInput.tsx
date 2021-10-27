import React from "react";

type handler = (value: string) => void;

interface PollInputParams {
  placeholder: string;
  inputHeader?: string;
  onChangeHandler: handler;
  pollValue: string;
}

export const PollInput = ({
  placeholder,
  inputHeader,
  pollValue,
  onChangeHandler,
}: PollInputParams) => {
  return (
    <div className={"flex flex-col"}>
      <div className={"my-2"}>{inputHeader !== null ? inputHeader : <></>}</div>
      <input
        className={
          "focus:outline-none text-center border border-black py-2 px-20"
        }
        type={"text"}
        placeholder={placeholder}
        value={pollValue}
        onChange={(e) => {
          onChangeHandler(e.target.value);
        }}
      />
    </div>
  );
};
