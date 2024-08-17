import React, { useState, useEffect, useContext } from "react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { RepoContext } from "../components/RepoContext";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../components/ButtonPrimary";

function Step2() {
  const { repos, setRepos, username, setUsername, userDetails, setUserDetails} = useContext(RepoContext); // Include setUsername
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  const handleNextStep = async () => {
    // Fetch summaries and update repos
    const selectedRepos = await Promise.all(
      repos.map(async (repo) => {
        if (checkedItems.includes(repo.id.toString())) {
          try {
            // Fetch summarized description for each selected repo
            const response = await fetch(
              `http://localhost:3000/github/repos/${username}/${repo.name}`
            );
            if (!response.ok) {
              console.error(`Failed to fetch summary for ${repo.name}`);
              return { ...repo, included: true };
            }
            const data = await response.json();
            return { ...repo, included: true, summary: data.summary };
          } catch (error) {
            console.error(`Error fetching summary for ${repo.name}:`, error);
            return { ...repo, included: true }; // Handle error by returning the repo without summary
          }
        } else {
          return { ...repo, included: false };
        }
      })
    );

    console.log("Username:", username);
    console.log("Updated Repositories:", selectedRepos);
    console.log("Updated User Details:", userDetails);

    // Update the context with the selected repos
    setRepos(selectedRepos);
    console.log(selectedRepos); // Logs the updated repos with the 'included' property

    // Navigate to the next step
    navigate("/step3");
  };

  const checkItems = (values) => {
    setCheckedItems(values);
  };

  if (!repos.length) {
    return <p>No repositories found. Please go back and fetch repositories.</p>;
  }

  return (
    <div className="text-center space-y-10">
      <h1 className="font-bold text-heading text-primary">
        Choose your repositories
      </h1>
      <div className="max-w-[600px] mx-auto border p-8 border-primary rounded-3xl overflow-y-auto max-h-[600px]">
        <CheckboxGroup
          colorScheme="primary"
          value={checkedItems}
          onChange={checkItems}
        >
          <Stack spacing={1} direction={["column"]}>
            {repos.map((repo) => (
              <Checkbox key={repo.id} value={repo.id.toString()}>
                {repo.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </div>
      <ButtonPrimary
        eventHandler={handleNextStep}
        label={"Next"}
      ></ButtonPrimary>
    </div>
  );
}

export default Step2;
