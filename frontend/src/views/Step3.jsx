import React, { useContext } from "react";
import { RepoContext } from "../components/RepoContext";

export default function Step3() {
  const { repos } = useContext(RepoContext);
  return (
    <div>
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
}
