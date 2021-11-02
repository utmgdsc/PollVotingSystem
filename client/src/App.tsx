import React from "react";
import { Navbar, Option } from "./components/Navbar";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { JoinPoll } from "./pages/JoinPoll";
import { VotePage } from "./pages/VotePage";
import { CreatePoll } from "./pages/CreatePoll";
import { ProfHome } from "./pages/ProfHome";
import { VoteControls } from "./pages/VoteControls";

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
    <div className={"flex flex-col bg-background h-full"}>
      <Navbar options={arr} />
      <div className={"flex h-full justify-center items-center"}>
        <BrowserRouter>
          <Switch>
            <Route exact path={"/vote"}>
              <VotePage />
            </Route>
            <Route exact path={"/createpoll"}>
              <CreatePoll />
            </Route>
            <Route exact path={"/prof"}>
              <ProfHome />
            </Route>
            <Route exact path={"/votecontrols"}>
              <VoteControls />
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
