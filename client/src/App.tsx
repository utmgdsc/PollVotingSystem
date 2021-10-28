import React from "react";
import { Navbar, Option } from "./components/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
    {
      name: "Github",
      href: "/github",
    },
    {
      name: "Logout",
      href: "/logout",
    },
  ];

  return (
    <div className={"h-screen bg-background"}>
      <Navbar options={arr} />
      <div className={"flex justify-center items-center"}>
        <BrowserRouter>
          <Switch>
            <Route exact path={"/"}>
              <JoinPoll />
            </Route>
            <Route exact path={"/vote"}>
              <VotePage
                options={5}
                question={"What's the runtime of the function?"}
              />
            </Route>
            <Route exact path={"/createpoll"}>
              <CreatePoll />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
