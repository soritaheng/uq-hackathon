import { useState, useEffect } from "react";
import { RepoContext } from "./components/RepoContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Step1 from "./views/Step1";
import Step2 from "./views/Step2";
import Step3 from "./views/Step3";
import Layout from "./components/Layout";

function App() {
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState("");
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
  const [currentStep, setCurrentStep] = useState(1);
  const [accessToken, setAccessToken] = useState("")
  const [email, setEmail] = useState(""); 
  const location = useLocation();
  const navigate = useNavigate();
  

  // useEffect(() => {
  //   if (currentStep === 1 && location.pathname !== "/step1") {
  //     navigate("/step1");
  //   } else if (currentStep === 2 && location.pathname !== "/step2") {
  //     navigate("/step2");
  //   } else if (currentStep === 3 && location.pathname !== "/step3") {
  //     navigate("/step3");
  //   }
  // }, [currentStep, location.pathname, navigate]);
  // useEffect(() => {
  //   if (currentStep === 1 && location.pathname !== "/step1") {
  //     navigate("/step1");
  //   } else if (currentStep === 2 && location.pathname !== "/step2") {
  //     navigate("/step2");
  //   } else if (currentStep === 3 && location.pathname !== "/step3") {
  //     navigate("/step3");
  //   }
  // }, [currentStep, location.pathname, navigate]);

  return (
    <RepoContext.Provider value={{ repos, setRepos, username, setUsername, userDetails, setUserDetails, theme, setTheme, currentStep, setCurrentStep, accessToken, setAccessToken, email, setEmail }}>
        <Layout>
        <Routes>
            <Route path="/step1" element={<Step1 />} />
            <Route path="/step2" element={<Step2 />} />
          {/* <Route path="/step2" element={currentStep >= 2 ? <Step2 /> : <Navigate to="/step1" />} /> */}
          <Route path="/step3" element={currentStep >= 3 ? <Step3 /> : <Navigate to="/step1" />} />
          <Route path="/" element={<Navigate to="/step1" />} />
          </Routes>
        </Layout>
      </RepoContext.Provider>
  );
}

export default App;
