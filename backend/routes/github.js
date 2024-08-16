const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

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

module.exports = router;
