import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Hr } from "./pages/Hr";
import SideBar from "./components/SideBar";
import { WorkerTable } from "./pages/WorkerTable";
import { Extra } from "./pages/Extra";
import usePreventZoom from "./utils/usePreventZoom";
import React, { useState } from "react";
import { WelcomeP } from "./pages/WelcomeP";

// function Greeting(props) {
//   const isLoggedIn = props.isLoggedIn;
//   if (isLoggedIn) {
//     return <WelcomeP />;
//   }
//   return <WorkerTable />;
// }

function App() {
  const [firstTime, setFirstTime] = useState(false);
  const updateData = (value) => {
    setFirstTime(value);
  };
  usePreventZoom();
  return firstTime ? (
    <SideBar>
      <Routes>
        <Route path="/" element={<WorkerTable />} />
        <Route path="/extra" element={<Extra />} />
        <Route path="/hr" element={<Hr />} />
      </Routes>
    </SideBar>
  ) : (
    <WelcomeP updateData={updateData} />
  );
}
export default App;
