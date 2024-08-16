import { createContext } from "react";

export const RepoContext = createContext({
  repos: [],
  setRepos: () => {},
});
