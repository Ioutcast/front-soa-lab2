import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Hr } from "./pages/Hr";
import SideBar from "./components/SideBar";
import { WorkerTable } from "./pages/WorkerTable";
import { Extra } from "./pages/Extra";
import usePreventZoom from "./utils/usePreventZoom";

function App() {
  usePreventZoom();
  return (
    <BrowserRouter>
      <SideBar>
        <Routes>
          <Route path="/" element={<WorkerTable />} />
          <Route path="/extra" element={<Extra />} />
          <Route path="/hr" element={<Hr />} />
        </Routes>
      </SideBar>
    </BrowserRouter>
  );
}

export default App;
