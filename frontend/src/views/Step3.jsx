import React, { useContext, useEffect, useState } from "react";
import { RepoContext } from "../components/RepoContext";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import CustomInput from "../components/CustomInput";
import CustomTextarea from "../components/CustomTextarea";
import { Select } from "@chakra-ui/react";

export default function Step3() {
  const { repos, userDetails, theme } = useContext(RepoContext);
  const [previewUrl, setPreviewUrl] = useState("");
  const [projectIndex, selectProjectIndex] = useState(0);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const selectedRepos = repos.filter((repo) => repo.included);

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
          Image: "https://picsum.photos/200", // Placeholder image, replace with your image logic if needed
        })),
      Theme: {
        Primary: theme.Primary,
        Secondary: theme.Secondary,
        Tertiary: theme.Tertiary,
      },
    };

    console.log(
      "Generated JSON Payload:",
      JSON.stringify(jsonPayload, null, 2)
    );

    // Make the POST request to the /generate/portfolio endpoint
    const fetchPreviewUrl = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/generate/portfolio",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonPayload),
          }
        );

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

  useEffect(() => {
    setProjectDescription(selectedRepos[projectIndex].summary);
    setProjectUrl(selectedRepos[projectIndex].url);
  }, [projectIndex]);

  return (
    <div>
      {/* {previewUrl ? (
        <iframe
          src={`http://localhost:3000/${previewUrl}`}
          style={{ width: "100%", height: "500px", border: "none" }}
          title="Web App Preview"
        ></iframe>
      ) : (
        <p>Loading preview...</p> // Loading state while waiting for the response
      )} */}
      <div>
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <h2>About Me</h2>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <div className="space-y-4">
                {Object.keys(userDetails).map((key) => {
                  return (
                    <div key={key} className="text-left max-w-[350px]">
                      <h3 className="mb-2">{key}</h3>
                      <CustomInput
                        defaultValue={userDetails[key]}
                        placeholder={`Enter ${key}`}
                      ></CustomInput>
                    </div>
                  );
                })}
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <h2>Projects</h2>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <div className="space-y-4">
                <Select
                  placeholder="Select project"
                  value={projectIndex}
                  onChange={(e) => selectProjectIndex(e.target.value)}
                >
                  {selectedRepos.map((repo, index) => (
                    <option key={index} value={index}>
                      {repo.name}
                    </option>
                  ))}
                </Select>
                <div className="text-left max-w-[350px]">
                  <h3 className="mb-2">Description</h3>
                  <CustomTextarea
                    value={projectDescription}
                    placeholder={"Enter description"}
                    eventHandler={(e) => setProjectDescription(e.target.value)}
                  ></CustomTextarea>
                </div>
                <div className="text-left max-w-[350px]">
                  <h3 className="mb-2">Link</h3>
                  <CustomInput
                    disabled={true}
                    value={projectUrl}
                    placeholder={"Enter link"}
                  ></CustomInput>
                </div>
                {/* <div className="text-left max-w-[350px]">
                  <h3 className="mb-2">Image</h3>
                  <CustomInput></CustomInput>
                </div> */}
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <h2>Theme</h2>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
