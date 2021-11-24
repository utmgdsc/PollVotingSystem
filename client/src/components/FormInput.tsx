import React from "react";

type handler = (value: string) => void;

interface PollInputParams {
  placeholder: string;
  header?: string;
  onChangeHandler: handler;
  pollValue: string;
  required?: boolean;
}

export const FormInput = ({
  placeholder,
  header,
  pollValue,
  onChangeHandler,
  required,
}: PollInputParams) => {
  return (
    <div className={"flex flex-col"}>
      <div className={"my-2 inline-block"}>
        {header !== null ? header : <></>}{" "}
        {required ? (
          <div className={"inline-block text-2xl text-red-500"}>*</div>
        ) : (
          <></>
        )}
      </div>
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
