const express = require("express");
const crypto = require('crypto');
const fs = require("fs");
require("dotenv").config();
const router = express.Router();
const path = require("path");
const token = process.env.GITHUB_API_TOKEN;

async function createOctokitInstance() {
  const { Octokit } = await import("@octokit/rest");
  return new Octokit({ auth: token });
}

const owner = "neeldave9";
const repo = "portfolio-test-1";
const branch = "main";
const filesFolder = path.join(__dirname, "/generated-webapps/5cafc377bcc72fae");

router.get("/", async (req, res) => {
  try {
    const octokit = await createOctokitInstance();

    const { data: repoData } =
      await octokit.rest.repos.createForAuthenticatedUser({
        name: repo,
        description: "A web application",
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
      const indexHtmlPath = files.find(file => file.endsWith('.html'));
      const stylesCssPath = files.find(file => file.endsWith('.css'));
      const scriptJsPath = files.find(file => file.endsWith('.js'));
      
      // Read the file contents
      const indexHtmlContent = await fs.promises.readFile(indexHtmlPath, 'utf8');
      const stylesCssContent = await fs.promises.readFile(stylesCssPath, 'utf8');
      const scriptJsContent = await fs.promises.readFile(scriptJsPath, 'utf8');
      
      const index_base64Content = Buffer.from(indexHtmlContent).toString('base64');
      const style_base64Content = Buffer.from(stylesCssContent).toString('base64');
      const script_base64Content = Buffer.from(scriptJsContent).toString('base64');
      
    await octokit.request(`PUT /repos/${owner}/${repo}/contents/index.html`, {
        owner: owner,
        repo: repo,
        path: `index.html`,
        message: 'my commit message',
        committer: {
          name: 'Neel Dave',
          email: 'neeldave0910@gmail.com'
        },
        content: index_base64Content,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      await octokit.request(`PUT /repos/${owner}/${repo}/contents/style.css`, {
        owner: owner,
        repo: repo,
        path: `style.css`,
        message: 'my commit message',
        committer: {
          name: 'Neel Dave',
          email: 'neeldave0910@gmail.com'
        },
        content: style_base64Content,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      await octokit.request(`PUT /repos/${owner}/${repo}/contents/script.js`, {
        owner: owner,
        repo: repo,
        path: `script.js`,
        message: 'my commit message',
        committer: {
          name: 'Neel Dave',
          email: 'neeldave0910@gmail.com'
        },
        content: script_base64Content,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

    

   

    await res.send(
      `files uploaded!`
    );
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).send("Error creating repository");
  }
});


  


module.exports = router;