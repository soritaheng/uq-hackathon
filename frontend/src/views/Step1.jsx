import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RepoContext } from "../components/RepoContext";
import Search from "../assets/search.svg";
import ButtonPrimary from "../components/ButtonPrimary";
import { useEffect } from "react";
const Step1 = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [error, setError] = useState("");
  const {
    repos,
    setRepos,
    username,
    setUsername,
    userDetails,
    setUserDetails,
    setCurrentStep,
    accessToken,
    setAccessToken,
  } = useContext(RepoContext);
  const navigate = useNavigate();
  const CLIENT_ID = "Ov23lituGiC8IRuZp0oJ";

  useEffect(() => {
    deleteAccessToken();
    const interval = setInterval(() => {
      fetch("http://localhost:3000/github/code")
        .then((response) => response.json())
        .then((data) => {
          console.log("Data received:", data); // Debug log to check received data

          if (data.access_token) {
            setAccessToken(data.access_token); // Set the access token
            clearInterval(interval);
            setCurrentStep(2);
            navigate("/step2"); // Call fetchData() after setting the access token
          }
        })
        .catch((error) => {
          console.error("Error fetching code from backend:", error);
        });
    }, 1000);

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const deleteAccessToken = async () => {
    try {
      const response = await fetch('http://localhost:3000/github/deleteAccessToken', {
        method: 'POST', // or 'DELETE' if you want to follow REST conventions
      });

      if (!response.ok) {
        throw new Error('Failed to delete access token');
      }

      const data = await response.text(); // If your backend returns plain text

      console.log(data); // Logs 'File deleted successfully'
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const fetchData = async () => {
  //   if (!usernameInput) {
  //     setError("Username is required");
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`http://localhost:3000/github/repos/${usernameInput}`);
  //     const data = await response.json();

  //     if (response.ok) {
  //       setRepos(data);
  //       setUsername(usernameInput);
  //       setError("");
  //       if (!userDetails || !userDetails.Name) {
  //         try {
  //           const userResponse = await fetch(`http://localhost:3000/github/${usernameInput}`);
  //           const userData = await userResponse.json();
  //           if (userResponse.ok) {
  //             setUserDetails({
  //               Name: userData.name || '',
  //               GitHubName: userData.login || '',
  //               AvatarURL: userData.avatar_url || '',
  //               Bio: userData.bio || '',
  //               Blog: userData.blog || ''
  //             });

  //           } else {
  //             console.error(userData.error || "Failed to fetch user details");
  //           }
  //         } catch (err) {
  //           console.error("Internal Server Error", err);
  //         }
  //       }
  //     } else {
  //       console.error(data.error || "Failed to fetch repositories");
  //     }
  //   } catch (err) {
  //     console.error("Internal Server Error", err);
  //   }
  // };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      loginWithGithub();
    }
  };

  function loginWithGithub() {
    const GITHUB_AUTH_URL =
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID+"&scope=user:email";
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
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)}
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
