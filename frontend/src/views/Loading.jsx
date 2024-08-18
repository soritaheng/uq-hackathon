import React, { useContext, useState, useEffect } from "react";
import { Spinner, Text, Link } from "@chakra-ui/react";
import Confetti from "react-confetti";
import { RepoContext } from "../components/RepoContext";

export default function Loading() {
  const { resultUrl } = useContext(RepoContext);
  const [msg, setMsg] = useState("Please wait until it finished");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(resultUrl);

        if (response.status !== 404) {
          console.log('Response is not 404, doing something...');
          setMsg("WE JUST DID IT!");
          setLoading(false);
          clearInterval(interval); // Stop further intervals since the website is deployed
        } else {
          console.log('Response is 404');
          setMsg("HOLD ON! WE'RE CODING FOR YOU!");
          setLoading(true);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }, 10000); // 10000ms = 10 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [resultUrl]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        position: "relative"
      }}
    >
      <Link href={resultUrl} isExternal color="teal.500" fontSize="xl">
        {resultUrl}
      </Link>
      <Text fontSize="lg" style={{ marginBottom: 20 }}>
        {msg}
      </Text>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Text fontSize="4xl" color="green.500">✔️</Text>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </>
      )}
    </div>
  );
}
