import React, { useState, useContext, useEffect } from "react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/react";
import { RepoContext } from "../components/RepoContext";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../components/ButtonPrimary";

function Step2() {
  
  const { repos, setRepos, setCurrentStep, username, setUsername,userDetails,setUserDetails, accessToken, setAccessToken, email, setEmail } = useContext(RepoContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(()=> {
    console.log(username)
    fetchData();
    fetchAccessToken();
    fetchUserEmail();
  },[])

  const fetchAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:3000/code");
      const data = await response.json();
  
      if (response.ok) {
        setAccessToken(data.access_token);
      } else {
        console.error(data.error || "Failed to fetch access token");
      }
    } catch (err) {
      console.error("Internal Server Error", err);
    }
  };

  const fetchData = async () => {
    if (!username) {
      setError("Username is required");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/github/repos/${username}`);
      const data = await response.json();

      if (response.ok) {
        setRepos(data);
        setUsername(username);
        setError("");
        if (!userDetails || !userDetails.Name) {
          try {
            const userResponse = await fetch(`http://localhost:3000/github/${username}`);
            const userData = await userResponse.json();
            if (userResponse.ok) {
              setUserDetails({
                Name: userData.name || '',
                GitHubName: userData.login || '',
                AvatarURL: userData.avatar_url || '',
                Bio: userData.bio || '',
                Blog: userData.blog || ''
              });
            } else {
              console.error(userData.error || "Failed to fetch user details");
            }
          } catch (err) {
            console.error("Internal Server Error", err);
          }
        }
      } else {
        console.error(data.error || "Failed to fetch repositories");
      }
    } catch (err) {
      console.error("Internal Server Error", err);
    }
  };

  const fetchUserEmail = async () => {
    try {

      const emailResponse = await fetch(`http://localhost:3000/github/user/emails?access_token=${accessToken}`);
      const emailData = await emailResponse.json();

      if (emailResponse.ok) {
        // Assuming the primary email is the first one in the array
        setEmail(emailData[0]?.email || "Email not found");
      } else {
        console.error(emailData.error || "Failed to fetch user emails");
      }
    } catch (err) {
      console.error("Internal Server Error", err);
    }
  };

  const handleNextStep = async () => {
    const selectedRepos = await Promise.all(
      repos.map(async (repo) => {
        if (checkedItems.includes(repo.id.toString())) {
          try {
            const response = await fetch(
              `http://localhost:3000/github/repos/${username}/${repo.name}`
            );
            if (!response.ok) {
              console.error(`Failed to fetch summary for ${repo.name}`);
              return { ...repo, included: true };
            }
            const data = await response.json();
            return { ...repo, included: true, summary: data.summary };
          } catch (error) {
            console.error(`Error fetching summary for ${repo.name}:`, error);
            return { ...repo, included: true };
          }
        } else {
          return { ...repo, included: false };
        }
      })
    );

    setRepos(selectedRepos);
    setCurrentStep(3);
    navigate("/step3");
  };

  const checkItems = (values) => {
    setCheckedItems(values);
  };

  if (!repos.length) {
    return <p>No repositories found. Please go back and fetch repositories.</p>;
  }

  return (
    <div className="text-center space-y-10">
      <h1 className="font-bold text-heading text-primary">
        Choose your repositories
      </h1>
      <div className="max-w-[600px] mx-auto border p-8 border-primary rounded-3xl overflow-y-auto max-h-[400px]">
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
      <ButtonPrimary eventHandler={handleNextStep} label={"Next"} />
    </div>
  );
}

export default Step2;
