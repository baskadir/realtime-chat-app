const express = require("express");

const port = 3200;

const app = express();

app.listen(() => {
  console.log(`Server running on ${port}`);
});
