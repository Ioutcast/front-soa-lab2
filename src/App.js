import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Hr } from "./pages/Hr";
import SideBar from "./components/SideBar";
import { WorkerTable } from "./pages/WorkerTable";
import { Extra } from "./pages/Extra";
import usePreventZoom from "./utils/usePreventZoom";
import React, { useState } from "react";
import { WelcomeP } from "./pages/WelcomeP";
import AwasomeTable from "./pages/AwasomeTable";
import Menu from "./pages/Menu";

function App() {
  const [firstTime, setFirstTime] = useState(false);
  const updateData = (value) => {
    setFirstTime(value);
  };
  // usePreventZoom();
  return (
    <>
      <Menu></Menu>
      {firstTime ? (
        <>
          <Routes>
            <Route path="/" element={<AwasomeTable />} />
            <Route path="/extra" element={<Extra />} />
            <Route path="/hr" element={<Hr />} />
          </Routes>
        </>
      ) : (
        <WelcomeP updateData={updateData} />
      )}
    </>
  );
}
export default App;
