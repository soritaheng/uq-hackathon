const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const CLIENT_ID = "Ov23li7rGmKa5yU7koL8"
const CLIENT_SECRET = "85b55e2e97e1b7fe64d4accca247e7784d24ba61";

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

app.get('/getAccessToken', async (req, res) => {
  const code = req.query.code;
  const params = "?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&code="+code;
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Exchange authorization code for access token
    const response = await axios.post("https://github.com/login/oauth/access_token"+params, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    }).then((response) =>{
      return response.json();
    }).then((data) => {
      console.log()
      res.json(data);
    })
    
    // const accessToken = response.data.access_token;

    // // Store the access token in session or local storage
    // // For demonstration, redirect with token as a query param
    // res.redirect(`/step1?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send('Authentication error');
  }
});

module.exports = router;
