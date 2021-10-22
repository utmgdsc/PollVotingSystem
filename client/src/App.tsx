import React from "react";
import { Navbar, Option } from "./components/Navbar";

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
    </div>
  );
};

export default App;
