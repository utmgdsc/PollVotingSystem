import React from "react";

type handler = (value: string) => void;

interface PollInputParams {
  placeholder: string;
  header?: string;
  onChangeHandler: handler;
  pollValue: string;
}

export const FormInput = ({
  placeholder,
  header,
  pollValue,
  onChangeHandler,
}: PollInputParams) => {
  return (
    <div className={"flex flex-col"}>
      <div className={"my-2"}>{header !== null ? header : <></>}</div>
      <input
        className={
          "focus:outline-none text-center border border-black py-2 px-1 w-auto"
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
