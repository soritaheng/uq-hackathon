const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const githubRoutes = require("./routes/github");
const generateRoutes = require("./routes/generate")
const deployRoutes = require("./routes/deploy.js")

app.use(cors());

app.use(express.json());

app.use("/github", githubRoutes);
app.use("/generate", generateRoutes)
app.use("/deploy", deployRoutes)
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
