const express = require('express');
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const path = require('path');
const { v4: uuid } = require("uuid");

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
    console.log(__dirname)
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})