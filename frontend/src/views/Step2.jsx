import React, { useState, useEffect, useContext } from "react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { RepoContext } from "../components/RepoContext";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../components/ButtonPrimary";

function Step2() {
  const { repos, setRepos } = useContext(RepoContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  // Initialize checked items from repos context
  useEffect(() => {
    if (repos && repos.length > 0) {
      setCheckedItems(repos.map((repo) => repo.id.toString()));
    } else {
      return (
        <p>No repositories found. Please go back and fetch repositories.</p>
      );
    }
  }, [repos]);

  const handleNextStep = () => {
    const selectedRepos = repos.map((repo) => ({
      ...repo,
      included: checkedItems.includes(repo.id.toString()),
    }));
    setRepos(selectedRepos);
    console.log(selectedRepos); // Logs the updated repos with the 'included' property
    navigate("/step3");
  };

  const checkItems = (values) => {
    setCheckedItems(values);
  };

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
