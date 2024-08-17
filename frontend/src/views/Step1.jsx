import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RepoContext } from "../components/RepoContext";
import Search from "../assets/search.svg";
import ButtonPrimary from "../components/ButtonPrimary";
import { useEffect } from "react";
const Step1 = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [error, setError] = useState("");
  const { repos, setRepos, username, setUsername, userDetails, setUserDetails, setCurrentStep, accessToken, setAccessToken } = useContext(RepoContext);
  const navigate = useNavigate();
  const CLIENT_ID = "Ov23libwStbcukGvRNUF";

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Making a request to your backend to check for the access token
        const response = await fetch("http://localhost:3000/github/getAccessToken");
        const data = await response.json();

        if (data.code) {
          // If the code is found in the response, exchange it for an access token
          setAccessToken(code)
          clearInterval(interval); // Stop further requests once the code is handled
          fetchData(); 
        }
      } catch (error) {
        console.error("Error fetching code from backend:", error);
      }
    }, 2000);

  }, []); 

  const fetchData = async () => {
    if (!usernameInput) {
      setError("Username is required");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/github/repos/${usernameInput}`);
      const data = await response.json();

      if (response.ok) {
        setRepos(data);
        setUsername(usernameInput);
        setError("");
        if (!userDetails || !userDetails.Name) {
          try {
            const userResponse = await fetch(`http://localhost:3000/github/${usernameInput}`);
            const userData = await userResponse.json();
            if (userResponse.ok) {
              setUserDetails({
                Name: userData.name || '',
                GitHubName: userData.login || '',
                AvatarURL: userData.avatar_url || '',
                Bio: userData.bio || '',
                Blog: userData.blog || ''
              });
              setCurrentStep(2);
              navigate("/step2");
            } else {
              console.error(userData.error || "Failed to fetch user details");
            }
          } catch (err) {
            console.error("Internal Server Error", err);
          }
        }
      } else {
        console.error(data.error || "Failed to fetch repositories");
      }
    } catch (err) {
      console.error("Internal Server Error", err);
    }
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  function loginWithGithub() {
    const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID;
    window.open(GITHUB_AUTH_URL, "_blank", "width=500,height=600");
  }

  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-28 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="lg:text-heading mb-4 lg:mb-8 font-bold tracking-tight text-primary text-2xl">
              Portfolio Maker
            </h1>
            <div className="w-full">
              <div className="relative flex max-w-[400px] m-auto">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter your GitHub username"
                  className="placeholder:text-primary-400 placeholder:font-light px-4 py-2 border rounded-full border-primary focus:outline-primary-700 w-full h-[50px]"
                  onKeyDown={handlePressEnter}
                />
                <button
                  onClick={loginWithGithub}
                  className="rounded-full bg-primary w-[65px] h-[50px] absolute flex right-0 justify-center items-center"
                >
                  <img src={Search} alt="" />
                </button>
                <div>
                  <button onClick={loginWithGithub}>
                  Login with Github
                  </button>
                </div>
                
              </div>
            </div>
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
