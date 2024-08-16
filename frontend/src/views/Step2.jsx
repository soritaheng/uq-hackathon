import React, { useState, useEffect } from "react";
import { Checkbox, CheckboxGroup, useCheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";

function Step2({ username }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const checkItems = (values) => {
    setCheckedItems(values);
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&type=all`
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
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
              <Checkbox value={repo.id.toString()}>{repo.name}</Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      ) : (
        <p>No repositories found.</p>
      )}
      <button className="">Next</button>
    </div>
  );
}

export default Step2;
