const express = require("express");
const Yup = require("yup");
const validateForm = require("../controllers/validateForm");
const pool = require("../db");
const bcrypt = require("bcrypt");

const router = express.Router();

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user && req.session.user.username) {
      res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      res.json({ loggedIn: false });
    }
  })
  .post(async (req, res) => {
    validateForm(req, res);

    const { username, password } = req.body;

    const existingUser = await pool.query(
      "SELECT id, username, passwordhash FROM users WHERE username=$1",
      [username]
    );

    if (existingUser.rowCount > 0) {
      const isPasswordOk = await bcrypt.compare(
        password,
        existingUser.rows[0].passwordhash
      );

      if (isPasswordOk) {
        req.session.user = {
          username,
          id: existingUser.rows[0].id,
        };
        res.json({ loggedIn: true, username });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password." });
      }
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password." });
    }
  });

router.post("/signup", async (req, res) => {
  validateForm(req, res);

  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT username FROM users WHERE username=$1",
    [username]
  );

  if (existingUser.rowCount === 0) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passwordhash) VALUES ($1,$2) RETURNING id, username",
      [username, hashedPassword]
    );

    req.session.user = {
      username,
      id: newUserQuery.rows[0].id,
    };
    res.json({ loggedIn: true, username });
  } else {
    res.json({ loggedIn: false, status: "Username was taken" });
  }
});

module.exports = router;
