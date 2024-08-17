import React, { useState, useEffect, useContext } from "react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { RepoContext } from "../components/RepoContext";
import { useNavigate } from "react-router-dom";

function Step2() {
  const { repos, setRepos } = useContext(RepoContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  // Initialize checked items from repos context
  useEffect(() => {
    if (repos && repos.length > 0) {
      setCheckedItems(repos.filter(repo => repo.included).map(repo => repo.id.toString()));
    }
  }, [repos]);

  const handleNextStep = () => {
    const selectedRepos = repos.map(repo => ({
      ...repo,
      included: checkedItems.includes(repo.id.toString())
    }));
    setRepos(selectedRepos);
    console.log(selectedRepos); // Logs the updated repos with the 'included' property
    navigate('/step3');
  };

  const checkItems = (values) => {
    setCheckedItems(values);
  };

  if (repos.length === 0) return <p>No repositories found. Please go back and fetch repositories.</p>;

  return (
    <div>
      <h1 className="font-bold text-xl">Step 2: GitHub Repositories</h1>
      <CheckboxGroup
        colorScheme="green"
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
      <button onClick={handleNextStep}>Next</button>
    </div>
  );
}

export default Step2;
