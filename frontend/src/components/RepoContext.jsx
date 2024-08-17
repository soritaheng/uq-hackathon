// RepoContext.jsx
import React, { createContext, useState } from 'react';

export const RepoContext = createContext();

export const RepoProvider = ({ children }) => {
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState('');

  return (
    <RepoContext.Provider value={{ repos, setRepos, username, setUsername }}>
      {children}
    </RepoContext.Provider>
  );
};
