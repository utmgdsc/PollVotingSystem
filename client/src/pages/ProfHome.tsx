import React from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useHistory } from "react-router-dom";

export const ProfHome = () => {
  const history = useHistory();
  return (
    <div className={"flex flex-col justify-center h-100%"}>
      <Header text={"Get started by creating or viewing past polls"} />
      <Button
        value={"Create Poll"}
        className={"my-1"}
        onClick={() => history.push("/createpoll")}
      />
      <Button
        value={"View Past Polls"}
        className={"my-1"}
        onClick={() => history.push("/pastpolls")}
      />
      <Button
        value={"Join Poll"}
        className={"my-1"}
        onClick={() => history.push("/join")}
      />
    </div>
  );
};
