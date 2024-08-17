const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

router.post("/portfolio", (req, res) => {
  const { UserDetails, Projects, Theme } = req.body; // Directly extract the objects from req.body
  if (!UserDetails || !Projects || !Theme) {
    return res.status(400).json({
      error:
        "UserDetails, Projects, and Theme are required in the request body.",
    });
  }

  const sessionId = crypto.randomBytes(8).toString("hex");
  const outputDir = path.join(__dirname, "generated-webapps", sessionId);
  fs.mkdirSync(outputDir, { recursive: true });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title> ${UserDetails.Name}</title>
  </head>
  <body style="background-color: #000000;">
  <header style="border: 1px solid ${Theme.Primary};">
    <img src="${UserDetails.AvatarURL}" alt="${
    UserDetails.Name
  }"  style="width:150px; height:150px; border-radius: 50%;">
    <h1>${UserDetails.GitHubName}</h1>
    <p>${UserDetails.Bio}</p>
    <a href="${UserDetails.Blog}" target="_blank">Blog</a>
  </header>
  <section>
    <h1 clss="project_title">Projects</h1>
    <div class="project_list">
      ${Projects.map(
        (project) => `
        <div class="project_card" style="border: 1px solid ${Theme.Primary};">
          <div class="project_header">
          <img class="profile-image" src="${project.Image}" alt="${UserDetails.Name}" style="width: 100px; height:100px; border-radius: 12px;" onerror="this.onerror=null; this.src='default-avatar.png';">
            <div class="project_detail">
            <h3 class="project_name">${project.Name}</h3>
            <p class="project_description">${project.Description}</p>
            </div>
          </div>
          <button class="project_links">
            <a href="${project.Link}" target="_blank">View Project</a>
          </button>
        </div>
      `
      ).join("")}

</section>
<script src="script.js"></script>
  </body>
  </html>
  

  `;

  const cssContent = `
  body {
    font-family: Arial, sans-serif;
    display: flex;
    gap: 30px;
    padding: 0 30px;
    justify-content: center;
    margin: 0;
    background-color: #000000;
  }
  header {
    position: sticky;
    max-height: 600px;
    top: 0;
    background-color: #1d1d1e;
    color: #ffffff;
    border-radius: 20px;
    padding: 25px;
    text-align: left;
    margin-top: 68px;
    width: 30%;
  }
  section {
    color: #fff;
    width: 70%;
  }

  .project_list {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .project_header {
    display: flex;
  }
  .project_detail {
    margin-left: 5%;
    display: flex;
    flex-direction: column;
  }
  .project-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
  }
  
  .project-image.image-error {
    background-color: #fff;
    width: 200px;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  .project_card {
    min-width: 800px;
    background-color: #1d1d1e;
    color: #ffffff;
    border-radius: 20px;
    padding: 20px;
    text-align: left;
    margin-bottom: 20px; /* Adds space between cards */
  }
  .project_links {
    background-color: transparent;
    border: none;
    padding: 0;
    display: inline-block;
    background-color: #fff;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    border-radius: 50px;
    font-size: 16px;
    margin-top: 20px;
  }
  .project_links a {
    text-decoration: none;
    color: #000;
    font-size: 16px;
    font-weight: medium;
    text-align: center;
    border: none;
  }
  
  
  
  
  
  
  `;

  const jsContent = `
    console.log('Web application generated successfully.');
  `;

  fs.writeFileSync(path.join(outputDir, "index.html"), htmlContent);
  fs.writeFileSync(path.join(outputDir, "styles.css"), cssContent);
  fs.writeFileSync(path.join(outputDir, "script.js"), jsContent);

  res.json({ url: `generate/preview/${sessionId}` });
});

router.use(
  "/preview",
  express.static(path.join(__dirname, "generated-webapps"))
);

module.exports = router;
