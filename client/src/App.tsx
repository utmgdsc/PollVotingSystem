import React from "react";
import { Navbar, Option } from "./components/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { JoinPoll } from "./pages/JoinPoll";
import { PollOptionButton } from "./components/PollOptionButton";

const App = () => {
  const arr: Array<Option> = [
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
    <div className={"min-h-screen bg-background"}>
      <Navbar options={arr} />
      <div className={"ml-auto mr-auto"}>
        <BrowserRouter>
          <Switch>
            <Route exact path={"/"}>
              <JoinPoll />
            </Route>
            <Route exact path={"/vote"}>
              <PollOptionButton name={"A"} />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
