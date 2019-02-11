const express = require("express");
const db = require("./data/db");
const server = express();

server.use(express.json());

// POST to /api/users
// server.post("/api/users", (req, res) => {

// })

// GET to /api/users
server.get("/api/users", (req, res) => {
    db
        .find()
        .then(users => {
            res.status(200).json({ success: true, users });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: "The information could not be retrieved." })
        });
})

server.listen(5000, () => {
    console.log("Running on port 5000");
})