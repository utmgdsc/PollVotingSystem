import React from "react";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";
import { ReactComponent as EditIcon } from "../assets/edit.svg";

interface FormQuestionProps {
  question: string;
}

export const FormQuestion = ({ question }: FormQuestionProps) => {
  const maxLength = 40;
  const questionPreview =
    question.length < maxLength
      ? question
      : `${question.substr(0, maxLength)}...`;
  return (
    <div className={"flex bg-white px-2 border border-black my-1"}>
      {questionPreview}
      <div className={"ml-auto h-auto flex cursor-pointer"}>
        <EditIcon className={"mx-1 fill-current hover:text-green-600"} />
        <DeleteIcon className={"mx-1 fill-current hover:text-red-600"} />
      </div>
    </div>
  );
};
