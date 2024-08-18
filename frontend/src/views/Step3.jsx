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
import ButtonPrimary from "../components/ButtonPrimary";
import { Select } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export default function Step3() {
  const { repos, userDetails, setUserDetails, setRepos, theme, email, setEmail } =
    useContext(RepoContext);
  const [previewUrl, setPreviewUrl] = useState("");
  const [projectIndex, selectProjectIndex] = useState(0);
  const selectedRepos = repos.filter((repo) => repo.included);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const [deployBtnDisabled, setDeployBtnDisabled] = useState(false);
  const [tempUserDetails, setTempUserDetails] = useState(userDetails);
  const [tempProjectDetails, setTempProjectDetails] = useState(selectedRepos);

  useEffect(() => {
    // Construct the JSON payload
    console.log(email)
    const jsonPayload = {
      UserDetails: {
        Name: userDetails.Name,
        GitHubName: userDetails.GitHubName,
        AvatarURL: userDetails.AvatarURL,
        Bio: userDetails.Bio,
        Blog: userDetails.Blog,
        Email: email,
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
    setDeployBtnDisabled(!saveBtnDisabled);
  }, [saveBtnDisabled]);

  const handleSaveData = () => {
    setUserDetails(tempUserDetails);
    setRepos(tempProjectDetails);
    setSaveBtnDisabled(true);
  };

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
                {Object.keys(tempUserDetails).map((key) => {
                  return (
                    <div key={key} className="text-left max-w-[350px]">
                      <h3 className="mb-2">{key}</h3>
                      <CustomInput
                        value={tempUserDetails[key]}
                        placeholder={`Enter ${key}`}
                        eventHandler={(e) => {
                          setSaveBtnDisabled(false);
                          setTempUserDetails((tempUserDetails) => ({
                            ...tempUserDetails,
                            ...{ [key]: e.target.value },
                          }));
                        }}
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
                  {tempProjectDetails.map((project, index) => (
                    <option key={index} value={index}>
                      {project.name}
                    </option>
                  ))}
                </Select>
                <div className="text-left max-w-[350px]">
                  <h3 className="mb-2">Description</h3>
                  <CustomTextarea
                    value={tempProjectDetails[projectIndex].summary}
                    placeholder={"Enter description"}
                    eventHandler={(e) => {
                      setSaveBtnDisabled(false);
                      setTempProjectDetails(
                        tempProjectDetails.map((detail) => {
                          if (
                            detail.name ===
                            tempProjectDetails[projectIndex].name
                          ) {
                            return { ...detail, summary: e.target.value };
                          } else {
                            return detail;
                          }
                        })
                      );
                    }}
                  ></CustomTextarea>
                </div>
                <div className="text-left max-w-[350px]">
                  <h3 className="mb-2">Link</h3>
                  <CustomInput
                    disabled={true}
                    value={selectedRepos[projectIndex].url}
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
            <AccordionPanel pb={4}></AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Button
          isDisabled={saveBtnDisabled}
          onClick={handleSaveData}
          variant="link"
          colorScheme="primary"
        >
          Save
        </Button>
        <ButtonPrimary
          isDisabled={deployBtnDisabled}
          label={"Deploy"}
          eventHandler={() => alert("hola")}
        ></ButtonPrimary>
      </div>
    </div>
  );
}
