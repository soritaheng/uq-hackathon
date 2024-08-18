import { Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";
import { RepoContext } from "../components/RepoContext";

export default function Loading() {
  const { resultUrl } = useContext(RepoContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>{resultUrl}</p>
      <p style={{ marginBottom: 20 }}>Please wait until it finished</p>
      <Spinner size="xl" />
    </div>
  );
}
