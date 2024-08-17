import React, { useContext, useEffect, useState } from "react";
import { RepoContext } from "../components/RepoContext";

export default function Step3() {
  const { repos, userDetails, theme } = useContext(RepoContext);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
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
        .filter((repo) => repo.included)
        .map((repo) => ({
          Name: repo.name,
          Description: repo.summary || "",
          Link: repo.url,
          Image: "https://picsum.photos/200" // Placeholder image, replace with your image logic if needed
        })),
      Theme: {
        Primary: theme.Primary,
        Secondary: theme.Secondary,
        Tertiary: theme.Tertiary,
      },
    };

    console.log("Generated JSON Payload:", JSON.stringify(jsonPayload, null, 2));

    // Make the POST request to the /generate/portfolio endpoint
    const fetchPreviewUrl = async () => {
      try {
        const response = await fetch("http://localhost:3000/generate/portfolio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonPayload),
        });

        if (response.ok) {
          const data = await response.json();
          setPreviewUrl(data.url); // Set the preview URL from the response
        } else {
          console.error("Failed to generate portfolio");
        }
      } catch (error) {
        console.error("Error occurred while generating portfolio:", error);
      }
    };

    fetchPreviewUrl(); // Trigger the fetch on component mount
  }, [repos, userDetails, theme]); // Dependencies to re-run the effect

  return (
    <div>
      {previewUrl ? (
        <iframe
          src={`http://localhost:3000/${previewUrl}`}
          style={{ width: "100%", height: "500px", border: "none" }}
          title="Web App Preview"
        ></iframe>
      ) : (
        <p>Loading preview...</p> // Loading state while waiting for the response
      )}
    </div>
  );
}
