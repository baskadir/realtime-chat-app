const pool = require("../db/index");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const checkLogin = (req, res) => {
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT id, username, passwordhash, userid FROM users WHERE username=$1",
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
        userid: existingUser.rows[0].userid,
      };
      res.json({ loggedIn: true, username });
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password." });
    }
  } else {
    res.json({ loggedIn: false, status: "Wrong username or password." });
  }
};

const handleSignup = async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT username FROM users WHERE username=$1",
    [username]
  );

  if (existingUser.rowCount === 0) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passwordhash, userid) VALUES ($1,$2,$3) RETURNING id, username, userid",
      [username, hashedPassword, uuidv4()]
    );

    req.session.user = {
      username,
      id: newUserQuery.rows[0].id,
      userid: newUserQuery.rows[0].userid,
    };
    res.json({ loggedIn: true, username });
  } else {
    res.json({ loggedIn: false, status: "Username was taken" });
  }
};

module.exports = { checkLogin, handleLogin, handleSignup };
