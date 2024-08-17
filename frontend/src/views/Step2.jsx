import React, { useState, useEffect, useContext } from "react";
import { Checkbox, CheckboxGroup, useCheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { RepoContext } from "../components/RepoContext";

function Step2({ username }) {
  const { setRepos, repos } = useContext(RepoContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const checkItems = (values) => {
    setCheckedItems(values);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //TODO: get username from url
  useEffect(() => {
    if (!repos) {
      const fetchRepos = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/github/repos/${username}`
          );
          if (!response.ok) {
            const errorBody = await response.text();
            console.error("Error body:", errorBody);
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }
          const data = await response.json();
          console.log("Fetched repos:", data); // Log fetched data
          setRepos(data);
          setCheckedItems(data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchRepos();
    } else {
      setCheckedItems(repos.map((repo) => repo.id.toString()));
      setLoading(false);
    }
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleNextStep = () => {
    const selectedRepos = repos.map((repo) => {
      if (checkedItems.includes(repo.id.toString())) {
        repo.included = true;
      } else {
        repo.included = false;
      }
      return repo;
    });

    setRepos(selectedRepos);
    console.log(repos);
  };

  return (
    <div>
      <h1 className="font-bold text-xl">Step 2: GitHub Repositories</h1>
      {repos.length > 0 ? (
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
      ) : (
        <p>No repositories found.</p>
      )}
      <button onClick={handleNextStep}>Next</button>
    </div>
  );
}

export default Step2;
