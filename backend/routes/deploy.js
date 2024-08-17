const express = require("express");
const fs = require("fs");
require("dotenv").config();
const router = express.Router();
const path = require("path");

router.post("/", async (req, res) => {
  try {

    const  data  = await req.body;

    async function createOctokitInstance() {
    const { Octokit } = await import("@octokit/rest");
    return new Octokit({ auth: data.GITHUB_API_TOKEN});
    }
    const owner = data.GITHUB_USERNAME;
    const repo = `portfolio-${Math.floor(Math.random() * 900) + 100}`;
    const filesFolder = path.join(__dirname, `/generated-webapps/${data.PROJECT_ID}`);

    const octokit = await createOctokitInstance();

    const { data: repoData } =
      await octokit.rest.repos.createForAuthenticatedUser({
        name: repo,
        description: "My personal coding portfolio website",
        private: false,
      });

    async function getFilesInFolder(folderPath) {
      const files = [];

      // Recursively list all files
      fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
          files.push(filePath);
        } else {
          files.push(...getFilesInFolder(filePath));
        }
      });

      return files;
    }

    const files = await getFilesInFolder(filesFolder);

    // Assuming there will always be 3 files
    const indexHtmlPath = files.find((file) => file.endsWith(".html"));
    const stylesCssPath = files.find((file) => file.endsWith(".css"));
    const scriptJsPath = files.find((file) => file.endsWith(".js"));

    // Read the file contents
    const indexHtmlContent = await fs.promises.readFile(indexHtmlPath, "utf8");
    const stylesCssContent = await fs.promises.readFile(stylesCssPath, "utf8");
    const scriptJsContent = await fs.promises.readFile(scriptJsPath, "utf8");

    const index_base64Content =
      Buffer.from(indexHtmlContent).toString("base64");
    const style_base64Content =
      Buffer.from(stylesCssContent).toString("base64");
    const script_base64Content =
      Buffer.from(scriptJsContent).toString("base64");

    await octokit.request(`PUT /repos/${owner}/${repo}/contents/index.html`, {
      owner: owner,
      repo: repo,
      path: `index.html`,
      message: "My Portfolio Commit!",
      committer: {
        name: data.Name,
        email: data.GITHUB_EMAIL,
      },
      content: index_base64Content,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    await octokit.request(`PUT /repos/${owner}/${repo}/contents/style.css`, {
      owner: owner,
      repo: repo,
      path: `style.css`,
      message: "My Portfolio Commit!",
      committer: {
        name: data.Name,
        email: data.GITHUB_EMAIL,
      },
      content: style_base64Content,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    await octokit.request(`PUT /repos/${owner}/${repo}/contents/script.js`, {
      owner: owner,
      repo: repo,
      path: `script.js`,
      message: "My Portfolio Commit!",
      committer: {
        name: data.Name,
        email: data.GITHUB_EMAIL,
      },
      content: script_base64Content,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const github_page_data = await octokit.request(
      `POST /repos/${owner}/${repo}/pages`,
      {
        owner: owner,
        repo: repo,
        source: {
          branch: "main"
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    await res.send(github_page_data);
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).send("Error creating repository");
  }
});

module.exports = router;
