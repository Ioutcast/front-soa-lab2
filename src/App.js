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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [firstTime, setFirstTime] = useState(false);
  const updateData = (value) => {
    setFirstTime(value);
  };
  usePreventZoom();
  return (
    <>
      <ToastContainer />
      <Menu></Menu>
      {firstTime ? (
        <>
          <Routes>
            <Route path="/" element={<AwasomeTable />} />
            <Route path="/extra" element={<Extra />} />
            <Route path="/hr" element={<Hr />} />
            <Route path="/create" element={<WorkerTable />} />
          </Routes>
        </>
      ) : (
        <WelcomeP updateData={updateData} />
      )}
    </>
  );
}
export default App;
