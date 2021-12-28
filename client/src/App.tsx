import React, { useState, useEffect } from "react";
import { Navbar, Option } from "./components/Navbar";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { JoinPoll } from "./pages/JoinPoll";
import { VotePage } from "./pages/VotePage";
import { CreatePoll } from "./pages/CreatePoll";
import { ProfHome } from "./pages/ProfHome";
import { VoteControls } from "./pages/VoteControls";
import { PastPolls } from "./pages/PastPolls";
import { instance } from "./axios";
import { instructor } from "./constants/constants";

const App = () => {
  const options: Array<Option> = [
    {
      name: "Create Poll",
      href: "/createpoll",
    },
    {
      name: "Past Polls",
      href: "/pastPolls",
    },
    {
      name: "Join Poll",
      href: "/join",
    },
  ];
  const empty: Array<Option> = [];
  const [isInstructor, setIsInstructor] = useState(false);
  const [arr, setArr] = useState(empty);
  useEffect(() => {
    const getUserStatus = async () => {
      await instance
        .get("/user")
        .then((res) => {
          const data = res.data.userType === instructor;
          if (data) setArr(options);
          else setArr(empty);
          setIsInstructor(data);
        })
        .catch(() => {
          // console.error(err);
          setArr(empty);
          setIsInstructor(false);
        });
    };
    getUserStatus();
  }, [isInstructor]);

  return (
    <div
      className={
        "h-screen overflow-x-hidden overflow-y-auto flex flex-col bg-background h-full"
      }
    >
      <BrowserRouter>
        <Navbar options={arr} />
        <div
          className={"mx-4 flex-wrap flex h-full justify-center items-center"}
        >
          <Switch>
            <Route exact path={"/vote"}>
              <VotePage />
            </Route>
            <Route exact path={"/join"}>
              <JoinPoll />
            </Route>
            <Route exact path={"/createpoll"}>
              {isInstructor ? <CreatePoll /> : <JoinPoll />}
            </Route>
            <Route exact path={"/votecontrols"}>
              {isInstructor ? <VoteControls /> : <JoinPoll />}
            </Route>
            <Route exact path={"/pastpolls"}>
              {isInstructor ? <PastPolls /> : <JoinPoll />}
            </Route>
            <Route path={"/"}>
              <Redirect to={"/"}></Redirect>
              {isInstructor ? <ProfHome /> : <JoinPoll />}
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
