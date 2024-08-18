const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const path = require('path')
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const CLIENT_ID = "Ov23lituGiC8IRuZp0oJ"
const CLIENT_SECRET = "59e89abae2ceb4844e9017f39879d08c3daebb68";

router.get("/repos/:username", async function (req, res, next) {
  try {
    const username = req.params['username'];
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const github_url = `https://api.github.com/users/${username}/repos?per_page=100&type=all`;
    const response = await fetch(github_url);
    const data = await response.json();

    if (!response.ok) {
      console.error("GitHub API Error:", data);
      return res.status(response.status).json({ error: data.message });
    }
    const filteredData = data.map(repo => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
    }));
    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function summarizeText(text) {
  const prompt = `Summarize the following project description in 2 sentences, highlight the aim of the project and its features. DO NOT TALK ABOUT ANYTHING ELSE.:\n\n${text}`;
  const result = await model.generateContent(prompt); // Assuming `model.generateContent` is your summarization method
  const response = await result.response;
  const summary = await response.text(); // Wait for the response text
  return summary;
}

router.get('/repos/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: `GitHub API Error: ${response.statusText}` });
    }
    const data = await (response.headers.get('Content-Type')?.includes('json') ? response.json() : response.text());
    const summary = await summarizeText(data);

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get("/code", async function (req, res, next) {
  const filePath = path.join(__dirname, '/access_token_response.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File does not exist
        return res.status(404).send('access_token_response.json not found');
      } else {
        // Some other error occurred
        console.error('Error reading file', err);
        return res.status(500).send('Error reading access_token_response.json');
      }
    }
    // If the file exists and was read successfully, send its contents
    res.send(data);
  });
});

router.get('/getAccessToken', async (req, res) => {
  try {
    console.log('its being triggered');
    const code = req.query.code;
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code
    });

    const response = await fetch(`https://github.com/login/oauth/access_token?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Ensure the response is OK before processing
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error during the request:', errorData);
      return res.status(response.status).json({ error: 'Failed to retrieve access token' });
    }

    const data = await response.json(); // Correctly parse the JSON response

    const filePath = path.join(__dirname, '/access_token_response.json');

    // Store the response data in a file
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: 'Failed to write file' });
      }
      console.log('Response data saved to', filePath);
      res.json("You are now authorised. Please close this window.");
    });
  } catch (error) {
    console.error('Error during the request:', error);
    res.status(500).json({ error: 'Failed to retrieve access token' });
  }
});

router.get("/:username", async function (req, res, next) {
  try {
    const username = req.params['username'];
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const github_url = `https://api.github.com/users/${username}`;
    const response = await fetch(github_url);
    const data = await response.json();

    if (!response.ok) {
      console.error("GitHub API Error:", data);
      return res.status(response.status).json({ error: data.message });
    }
    const filteredData = {
      name: data.name,
      login: data.login,
      avatar_url: data.avatar_url,
      bio: data.bio,
      blog: data.blog,
    };
    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
