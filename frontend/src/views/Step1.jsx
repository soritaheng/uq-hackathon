import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RepoContext } from "../components/RepoContext";
import Search from "../assets/search.svg";
import ButtonPrimary from "../components/ButtonPrimary";

const Step1 = () => {
  const [usernameInput, setUsernameInput] = useState(""); // Renamed to avoid confusion
  const [error, setError] = useState("");
  const { repos, setRepos, username, setUsername } = useContext(RepoContext); // Include setUsername
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
        navigate("/step2"); // Redirect to the next step
      } else {
        console.error(data.error || "Failed to fetch repositories");
      }
    } catch (err) {
      console.error("Internal Server Error", err);
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
                  className="placeholder:text-primary-400 placeholder:font-light px-4 py-2 border rounded-full border-primary  focus:outline-primary-700 w-full"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <img src={Search} alt="" />
                </span>
              </div>
            </div>
            {error && <p className=" text-red-600 mt-4">{error}</p>}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <ButtonPrimary eventHandler={fetchData} label={"Get started"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
