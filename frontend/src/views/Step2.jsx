import React, { useState, useEffect, useContext } from "react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { RepoContext } from "../components/RepoContext";
import { useNavigate } from "react-router-dom";

function Step2() {
  const { repos, setRepos, username, setUsername } = useContext(RepoContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (repos && repos.length > 0) {
      // Initialize checked items based on repos context
      setCheckedItems(repos.filter(repo => repo.included).map(repo => repo.id.toString()));
    }
  }, [repos]);

  const handleNextStep = async () => {
    // Fetch summaries and update repos
    const selectedRepos = await Promise.all(repos.map(async (repo) => {
      if (checkedItems.includes(repo.id.toString())) {
        try {
          // Fetch summarized description for each selected repo
          const response = await fetch(`http://localhost:3000/github/repos/${username}/${repo.name}`);
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
    }));

    console.log('Username:', username);
    console.log('Updated Repositories:', selectedRepos);
    
    // Update the context with the selected repos
    setRepos(selectedRepos);
    
    // Navigate to the next step
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
