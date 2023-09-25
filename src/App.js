import './styles/App.css';
import LeftSideBar from "./components/LeftSideBar";
import {WorkesTable} from "./components/WorkesTable";


function App() {
  return (
      <>
      <LeftSideBar />
      <WorkesTable/>
      </>
  );
}

export default App;
