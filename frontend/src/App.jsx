import { useState } from "react";
import { RepoContext } from "./components/RepoContext";
import { Outlet } from "react-router-dom";
import Step1 from "./views/Step1";
import Step3 from "./views/Step3";
import Layout from "./components/Layout";

function App() {
  const [repos, setRepos] = useState([]);

  return (
    <div>
      <RepoContext.Provider value={{ repos, setRepos }}>
        <Layout>
          <Outlet />
        </Layout>
      </RepoContext.Provider>
    </div>
  );
}

export default App;
