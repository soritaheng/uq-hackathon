import React, { useState } from "react";

const Step1 = () => {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);

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
        setRepos(data);
        setError("");
      } else {
        setError(data.error || "Failed to fetch repositories");
      }
    } catch (err) {
      setError("Internal Server Error");
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="mx-auto max-w-2xl py-28 sm:py-48 lg:py-56">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
              Portfolio Maker
            </h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
            />
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <button onClick={fetchData}>
                <a
                  href="#"
                  class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Step1;
