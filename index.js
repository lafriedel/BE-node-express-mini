const express = require("express");
const db = require("./data/db");
const server = express();

server.use(express.json());

// POST to /api/users
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  const newUser = { name, bio };

  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(newUser)
    .then(newUserId => {
      const { id } = newUserId;

      db.findById(id).then(user => {
        res.status(201).json({ user });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the user to the database."
      });
    });
});

// GET to /api/users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.status(500).json({
        error: "The users information could not be retrieved."
      });
    });
});

// GET to /api/users/:id
server.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      if (user) {
        return res.status(200).json({ user });
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The user information could not be retrieved."
      });
    });
});

// DELETE to /api/users/:id
server.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      // might be able to take out this if statement, will try once submitted
      if (user) {
        db.remove(userId)
          .then(deletedUser => {
            res.status(200).json({ user });
          })
          .catch(err => {
            res.status(500).json({
              error: "The user could not be removed."
            });
          });
      } else {
        res.status(404).json({
          error: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(404).json({
        message: "The user with the specified ID does not exist."
      });
    });
});

// PUT to /api/users/:id
server.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const { name, bio } = req.body;
  const newUser = { name, bio };

  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.findById(userId)
    .then(user => {
    // may also be able to remove this if statement
      if (user) {
        db.update(userId, newUser)
          .then(updatedUser => {
            db.findById(userId).then(updatedUser => {
              res.status(200).json({ updatedUser });
            });
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: "The user information could not be modified." });
          });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    });
});

server.listen(5000, () => {
  console.log("Running on port 5000");
});
