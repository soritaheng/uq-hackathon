import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RepoContext } from "../components/RepoContext";
import Search from "../assets/search.svg";
import ButtonPrimary from "../components/ButtonPrimary";

const Step1 = () => {
  const [usernameInput, setUsernameInput] = useState(""); // Renamed to avoid confusion
  const [error, setError] = useState("");
  const { repos, setRepos, username, setUsername, userDetails, setUserDetails} = useContext(RepoContext); // Include setUsername
  //const {} = useContext(RepoContext); // Include setUsername
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!usernameInput) {
      setError("Username is required");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/github/repos/${usernameInput}`
      );
      const data = await response.json();

      if (response.ok) {
        setRepos(data); // Update the repositories in the context
        setUsername(usernameInput); // Set the username in the context
        
        setError("");
        //navigate("/step2"); // Redirect to the next step
      } else {
        console.error(data.error || "Failed to fetch repositories");
      }
    } catch (err) {
      console.error("Internal Server Error", err);
    }


    // Fetch user details only if not already fetched
    if (!userDetails || !userDetails.Name) {
      try {
        const response = await fetch(`http://localhost:3000/github/${usernameInput}`);
        const data = await response.json();
        console.log("API Response for User Details:", data); // Log API response

        if (response.ok) {
          setUserDetails({
            Name: data.name || '',
            GitHubName: data.login || '',
            AvatarURL: data.avatar_url || '',
            Bio: data.bio || '',
            Blog: data.blog || ''
          });
          //console.log("User Details", userDetails); // For debugging

          navigate("/step2"); // Redirect to the next step
        } else {
          console.error(data.error || "Failed to fetch user details");
        }
      } catch (err) {
        console.error("Internal Server Error", err);
      }
    }
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

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
                  className="placeholder:text-primary-400 placeholder:font-light px-4 py-2 border rounded-full border-primary  focus:outline-primary-700 w-full h-[50px]"
                  onKeyDown={handlePressEnter}
                />
                <button
                  onClick={fetchData}
                  className="rounded-full bg-primary w-[65px] h-[50px] absolute flex right-0 justify-center items-center"
                >
                  <img src={Search} alt="" />
                </button>
              </div>
            </div>
            {error && <p className=" text-red-600 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
