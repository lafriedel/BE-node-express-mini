const express = require("express");
const db = require("./data/db");
const server = express();

server.use(express.json());

// POST to /api/users -- I'm getting the right responses, but it's still inserting the user no matter what
server.post("/api/users", (req, res) => {
  const user = req.body;

  db.insert(user)
    .then(newUser => {
      // if (!user[bio] || !user[id]) {
      //     res.status(400).json({ success: false, error: "Please provide name and bio for the user." })
      // } else {
      //     res.status(201).json({ success: true, user });
      // }
      if (user.name && user.bio) {
        res.status(201).json({ success: true, newUser });
      } else {
        res
          .status(400)
          .json({
            success: false,
            error: "Please provide name and bio for the user."
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          success: false,
          error: "There was an error while saving the user to the database."
        });
    });
});

// GET to /api/users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ success: true, users });
    })
    .catch(err => {
      res
        .status(500)
        .json({
          success: false,
          error: "The information could not be retrieved."
        });
    });
});

server.listen(5000, () => {
  console.log("Running on port 5000");
});

// GET to /api/users/:id
server.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res
          .status(404)
          .json({
            success: false,
            message: "The user with the specified ID does not exist."
          });
      }
    })
    .catch(err => {
        res.status(500).json({ success: false, error: "The user information could not be retrieved." });
    });
});
