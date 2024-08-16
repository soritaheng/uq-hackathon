const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/repos/:username", async function (req, res, next) {
  try {
    const username = req.params["username"]; // Capture the username from the URL parameter

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

    // Map over the response data to extract only the required fields
    const filteredData = data.map((repo) => ({
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

module.exports = router;
