import { useState } from "react";
import { RepoContext } from "./components/RepoContext";
import { Outlet } from "react-router-dom";
import Step1 from "./views/Step1";
import Step3 from "./views/Step3";
import Step2 from "./views/Step2";

function App() {
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState([]);

  return (
    <div>
      <RepoContext.Provider value={{ repos, setRepos, username, setUsername}}>
        <Outlet />
      </RepoContext.Provider>
    </div>
  );
}

export default App;
