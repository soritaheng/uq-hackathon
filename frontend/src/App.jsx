import { useState } from "react";
import { RepoContext } from "./components/RepoContext";
import { Outlet, BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Step1 from "./views/Step1";
import Step3 from "./views/Step3";
import Step2 from "./views/Step2";
import Layout from "./components/Layout";

function App() {
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState([]);
  const [userDetails, setUserDetails] = useState({
    Name: "",
    GitHubName: "",
    AvatarURL: "",
    Bio: "",
    Blog: "",
  });
  const [theme, setTheme] = useState({
    Primary: "#3498db",
    Secondary: "#2ecc71",
    Tertiary: "#e74c3c",
  });

  return (
    <div>
      <RepoContext.Provider value={{ repos, setRepos, username, setUsername, userDetails, setUserDetails, theme, setTheme }}>
        <Layout>
        <Routes>
            {/* Layout wrapping all routes */}
            <Route path="/" element={<Layout />} />
            {/* Route for /step1 */}
            <Route path="/step1" element={<Step1 />} />
            
            {/* Redirect root path / to /step1 */}
            <Route index element={<Navigate to="/step1" />} />

            {/* Catch-all route that redirects any other path to /step1 */}
            <Route path="*" element={<Navigate to="/step1" replace />} />
          </Routes>
          <Outlet />
        </Layout>
      </RepoContext.Provider>
    </div>
  );
}

export default App;
