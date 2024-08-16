const express = require('express');
const app = express();
const port = 3000;

const githubRoutes = require('./routes/github');

app.use(express.json());

app.use('/github', githubRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
