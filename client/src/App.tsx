import React from "react";
import { Navbar, Option } from "./components/Navbar";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { JoinPoll } from "./pages/JoinPoll";
import { VotePage } from "./pages/VotePage";
import { CreatePoll } from "./pages/CreatePoll";
import { ProfHome } from "./pages/ProfHome";
import { VoteControls } from "./pages/VoteControls";
import Cookies from "universal-cookie";
import { pollCodeCookie, pollIdCookie } from "./constants/constants";

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

  const cookies = new Cookies();

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
              {console.log(cookies.get(pollCodeCookie))}
              {console.log(cookies.get(pollIdCookie))}
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

//             {/*{cookies.remove(pollIdCookie)}*/}
//               {/*{cookies.remove(pollCodeCookie)}*/}
// {cookies.get(pollCodeCookie) === undefined || cookies.get(pollIdCookie) === undefined ?
//                <Redirect to={"/"}></Redirect> : <VoteControls />}
