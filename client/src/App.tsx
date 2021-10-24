import React from "react";
import { Navbar, Option } from "./components/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { JoinPoll } from "./pages/JoinPoll";
import { VotePage } from "./pages/VotePage";

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
      <div className={"flex justify-center py-2 my-3"}>
        <BrowserRouter>
          <Switch>
            <Route exact path={"/"}>
              <JoinPoll />
            </Route>
            <Route exact path={"/vote"}>
              <VotePage options={5} question={"Test Question"} />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
