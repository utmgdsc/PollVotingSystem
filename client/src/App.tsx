import React from "react";
import { Navbar, Option } from "./components/Navbar";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { JoinPoll } from "./pages/JoinPoll";
import { VotePage } from "./pages/VotePage";
import { CreatePoll } from "./pages/CreatePoll";

const App = () => {
  const arr: Array<Option> = [
    {
      name: "Create Poll",
      href: "/createpoll",
    },
    {
      name: "Past Polls",
      href: "/pastPolls",
    },
  ];

  return (
    <div className={"h-screen bg-background"}>
      <Navbar options={arr} />
      <div className={"flex justify-center items-center"}>
        <BrowserRouter>
          <Switch>
            <Route exact path={"/vote"}>
              <VotePage />
            </Route>
            <Route exact path={"/createpoll"}>
              <CreatePoll />
            </Route>
            <Route path={"/"}>
              <Redirect to={"/"}></Redirect>
              <JoinPoll />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
