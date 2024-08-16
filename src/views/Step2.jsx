import React, { useState, useEffect } from 'react';

function Step2({ username }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=all`);
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Error body:', errorBody);
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched repos:', data); // Log fetched data
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
      <h1>Step 2: GitHub Repositories</h1>
      {repos.length > 0 ? (
        <ul>
          {repos.map(repo => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
  
}

export default Step2;
