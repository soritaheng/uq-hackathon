import React, { useState, useContext } from "react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { RepoContext } from "../components/RepoContext";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../components/ButtonPrimary";

function Step2() {
  const { repos, setRepos, username, setCurrentStep } = useContext(RepoContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  const handleNextStep = async () => {
    const selectedRepos = await Promise.all(
      repos.map(async (repo) => {
        if (checkedItems.includes(repo.id.toString())) {
          try {
            const response = await fetch(`http://localhost:3000/github/repos/${username}/${repo.name}`);
            if (!response.ok) {
              console.error(`Failed to fetch summary for ${repo.name}`);
              return { ...repo, included: true };
            }
            const data = await response.json();
            return { ...repo, included: true, summary: data.summary };
          } catch (error) {
            console.error(`Error fetching summary for ${repo.name}:`, error);
            return { ...repo, included: true };
          }
        } else {
          return { ...repo, included: false };
        }
      })
    );

    setRepos(selectedRepos);
    setCurrentStep(3);
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
      />
    </div>
  );
}

export default Step2;
