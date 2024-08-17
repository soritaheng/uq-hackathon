const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

router.post("/portfolio", (req, res) => {
  const { UserDetails, Projects, Theme } = req.body;  // Directly extract the objects from req.body
  if (!UserDetails || !Projects || !Theme) {
    return res.status(400).json({ error: "UserDetails, Projects, and Theme are required in the request body." });
  }

  const sessionId = crypto.randomBytes(8).toString('hex');
  const outputDir = path.join(__dirname, "generated-webapps", sessionId);
  fs.mkdirSync(outputDir, { recursive: true });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="styles.css">
      <title>${UserDetails.Name}</title>
    </head>
    <body style="background-color: ${Theme.Primary}; color: ${Theme.Secondary};">
      <header>
        <img src="${UserDetails.AvatarURL}" alt="${UserDetails.Name}" style="width: 100px; border-radius: 50%;">
        <h1>${UserDetails.GitHubName}</h1>
        <p>${UserDetails.Bio}</p>
        <a href="${UserDetails.Blog}" target="_blank">Blog</a>
      </header>
      <section>
        <h2>Projects</h2>
        <ul>
          ${Projects.map(project => `
            <li>
              <h3>${project.Name}</h3>
              <p>${project.Description}</p>
              <a href="${project.Link}" target="_blank">View Project</a>
              ${project.Image ? `<img src="${project.Image}" alt="${project.Name}" style="width: 200px;">` : ''}
            </li>
          `).join('')}
        </ul>
      </section>
      <script src="script.js"></script>
    </body>
    </html>
  `;

  const cssContent = `
    body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        text-align: center;
        padding: 50px;
    }
    h1 {
        color: #333;
    }
  `;

  const jsContent = `
    console.log('Web application generated successfully.');
  `;

  fs.writeFileSync(path.join(outputDir, 'index.html'), htmlContent);
  fs.writeFileSync(path.join(outputDir, 'styles.css'), cssContent);
  fs.writeFileSync(path.join(outputDir, 'script.js'), jsContent);

  res.json({ url: `generate/preview/${sessionId}` });
});

router.use('/preview', express.static(path.join(__dirname, 'generated-webapps')));

module.exports = router;