const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "abcd",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "1234",
  },
};

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"] };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"] };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user_id: req.cookies["user_id"] };

  if (!templateVars.user_id) {
    res.status(403).send("You are not logged in");
    return;
  }

  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"] };

  if (!templateVars.user_id) {
    res.status(403).send("You are not logged in");
    return;
  }
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"] };

  if (!templateVars.user_id) {
    res.status(403).send("You are not logged in");
    return;
  }

  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  let longURL = req.body["longURL"];
  if (!longURL.includes("http://")) {
    longURL = "http://" + longURL;
  }
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  checkEmail = req.body.email;
  checkPswd = req.body.password;

  if (checkBlanks(checkEmail, checkPswd) === "yes") {
    res.status(400).send("Please fill out BOTH required fields");
    return;
  }

  if (emailValidate(checkEmail, users)) {
    res.status(400).send("Sorry that Email is already registered");
    return;
  }

  const userID = generateRandomString();

  users[userID] = {
    ["id"]: userID,
    ["email"]: req.body.email,
    ["password"]: req.body.password,
  };

  const userEmail = req.body.email;
  res.cookie("user_id", userEmail);
  const templateVars = { user_id: req.cookies["user_id"] };
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  res.redirect("/urls/" + shortURL);
});

app.post("/login", (req, res) => {
  checkEmail = req.body.email;
  checkPswd = req.body.password;

  if (checkBlanks(checkEmail, checkPswd) === "yes") {
    res.status(403).send("Please fill out BOTH required fields");
    return;
  }
  if (loginValidate(checkEmail, checkPswd)) {
    const UserID = req.body.email;
    res.cookie("user_id", UserID);
    res.redirect("/urls");
  } else {
    res
      .status(403)
      .send("Sorry your login credentials didnt match any on file");
  }
});

app.post("/edit", (req, res) => {
  let editURL = req.body.editURL;
  const shortURL = req.body.shURL;
  if (!editURL.includes("http://")) {
    editURL = "http://" + editURL;
  }
  urlDatabase[shortURL] = editURL;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  const templateVars = { user_id: req.cookies["user_id"] };
  res.clearCookie("user_id", templateVars.user_id);
  res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL],
    user_id: req.cookies["user_id"],
  };

  if (!templateVars.user_id) {
    res.status(403).send("You are not logged in");
    return;
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  if (!templateVars.user_id) {
    res.status(403).send("You are not logged in");
    return;
  }
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function emailValidate(attEmail, obj) {
  for (let num in obj) {
    if (obj[num]["email"] === attEmail) {
      return true;
    }
  }
  return false;
}

function loginValidate(Email, Password) {
  for (let userT in users) {
    if (
      users[userT]["email"] === Email &&
      users[userT]["password"] === Password
    ) {
      return true;
    }
  }
  return false;
}

function checkBlanks(Email, Password) {
  if (Email === "" || Password == "") {
    return "yes";
  }
  return "no";
}

function generateRandomString() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
