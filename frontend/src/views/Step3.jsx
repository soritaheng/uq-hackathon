import React, { useContext } from "react";
import { RepoContext } from "../components/RepoContext";

export default function Step3() {
  //const { repos } = useContext(RepoContext);

  const { repos, setRepos, username, setUsername, userDetails, setUserDetails, theme, setTheme} = useContext(RepoContext); // Include setUsername

  // Construct the JSON payload
  const jsonPayload = {
    UserDetails: {
      Name: userDetails.Name,
      GitHubName: userDetails.GitHubName,
      AvatarURL: userDetails.AvatarURL,
      Bio: userDetails.Bio,
      Blog: userDetails.Blog,
    },
    Projects: repos
    .filter(repo => repo.included)
    .map((repo) => ({
      Name: repo.name,
      Description: repo.summary || "",
      Link: repo.url,
      Image: "https://picsum.photos/200"
      //Image: repo.image || "" // Assuming 'image' is a field you may want to include.
    })),
    Theme: {
      Primary: theme.Primary,
      Secondary: theme.Secondary,
      Tertiary: theme.Tertiary,
    }
  };

  console.log("Generated JSON Payload:", JSON.stringify(jsonPayload, null, 2));

  return (
    <div>
      {/* <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul> */}

    <iframe
      src={`http://localhost:3000/generate/preview/7768ebc92d687668`}
      style={{ width: '100%', height: '500px', border: 'none' }}
      title="Web App Preview"
    ></iframe>
    </div>
  );
}