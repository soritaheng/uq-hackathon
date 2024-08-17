import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RepoContext } from "../components/RepoContext";

const Step1 = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setRepos } = useContext(RepoContext); // Extract the setRepos function from RepoContext to update the context
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!username) {
      setError("Username is required");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/github/repos/${username}`
      );
      const data = await response.json();

      if (response.ok) {
        setRepos(data); // Update the repositories in the context
        setError("");
        navigate("/step2");
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
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
              Portfolio Maker
            </h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button onClick={fetchData}>
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
