const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const helpers = require("./helpers");
const methodOverride = require("method-override");
const moment = require("moment");

const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(
  cookieSession({
    name: "user_Id",
    keys: ["my secret", "my super secret"],

    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.set("view engine", "ejs");

const visitsDb = {};

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
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

app.get("/", (req, res) => {
  const id = req.session.user_Id;

  if (id) {
    res.redirect(`/urls`);
    return;
  }

  res.redirect(`/login`);
});

//-------------------------------------------------------------------------

app.get("/register", (req, res) => {
  const id = req.session.user_Id;
  const user = users[id];

  if (user) {
    res.redirect(`/urls`);
    return;
  }

  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_register", templateVars);
});

//-------------------------------------------------------------------------

app.get("/login", (req, res) => {
  const id = req.session.user_Id;
  const user = users[id];

  if (user) {
    res.redirect(`/urls`);
    return;
  }

  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_login", templateVars);
});

//-------------------------------------------------------------------------

app.get("/urls/new", (req, res) => {
  const id = req.session.user_Id;
  const user = users[id];

  if (!id) {
    res.redirect(`/login`);
    return;
  }

  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

//-------------------------------------------------------------------------

app.get("/urls", (req, res) => {
  const id = req.session.user_Id;

  if (!id) {
    res.status(403).send("You are not logged in");
    return;
  }

  const user = users[id];

  const ojbector = helpers.urlsForUser(id, urlDatabase);

  const templateVars = { urls: ojbector, user: user };
  res.render("urls_index", templateVars);
});

//-------------------------------------------------------------------------

app.post("/urls", (req, res) => {
  const id = req.session.user_Id;

  if (!id) {
    res.status(403).send("You are not logged in");
    return;
  }

  const shortURL = helpers.generateRandomString();
  let longURL = req.body["longURL"];
  if (!longURL.includes("http://")) {
    longURL = "http://" + longURL;
  }

  urlDatabase[shortURL] = {
    ["longURL"]: longURL,
    ["userID"]: id,
  };

  res.redirect("/urls");
});

//-------------------------------------------------------------------------

app.post("/register", (req, res) => {
  const checkEmail = req.body.email;
  const checkPswd = req.body.password;
  const hashedPassword = bcrypt.hashSync(checkPswd, 10);

  if (helpers.checkBlanks(checkEmail, checkPswd) === "yes") {
    res.status(400).send("Please fill out BOTH required fields");
    return;
  }

  if (helpers.emailValidate(checkEmail, users)) {
    res.status(400).send("Sorry that Email is already registered");
    return;
  }

  const userID = helpers.generateRandomString();

  users[userID] = {
    ["id"]: userID,
    ["email"]: req.body.email,
    ["password"]: hashedPassword,
  };

  req.session.user_Id = userID;
  res.redirect(`/urls`);
});

//-------------------------------------------------------------------------

app.delete("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.user_Id;

  if (!id) {
    res.status(403).send("You are not logged in");
    return;
  }

  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//-------------------------------------------------------------------------

app.post("/urls/:id", (req, res) => {

  const id = req.session.user_Id;

  if (!id) {
    res.status(403).send("You are not logged in");
    return;
  }

  const shortURL = req.params.id;

  res.redirect("/urls/" + shortURL);
});

//-------------------------------------------------------------------------

app.post("/login", (req, res) => {
  const checkEmail = req.body.email;
  const checkPswd = req.body.password;

  if (helpers.checkBlanks(checkEmail, checkPswd) === "yes") {
    res.status(403).send("Please fill out BOTH required fields");
    return;
  }

  let finalPass = "";
  for (let key in users) {
    if (users[key].email === checkEmail) {
      finalPass = users[key].password;
    }
  }

  const tempPswd = bcrypt.compareSync(checkPswd, finalPass);

  if (tempPswd) {
    const userID = helpers.loginValidate(checkEmail, finalPass, users);
    if (userID) {
      req.session.user_Id = userID;
      res.redirect("/urls");
    } else {
      res
        .status(403)
        .send("Sorry your login credentials didnt match any on file");
    }
  } else {
    res
      .status(403)
      .send("Sorry your login credentials didnt match any on file");
  }
});

//-------------------------------------------------------------------------

app.put("/edit", (req, res) => {
  const id = req.session.user_Id;

  if (!id) {
    res.status(403).send("You are not logged in");
    return;
  }

  let editURL = req.body.editURL;
  const shortURL = req.body.shURL;

  if (!editURL.includes("http://")) {
    editURL = "http://" + editURL;
  }

  urlDatabase[shortURL].longURL = editURL;

  res.redirect("/urls");
});

//-------------------------------------------------------------------------

app.post("/logout", (req, res) => {
  res.clearCookie("user_Id");
  res.clearCookie("user_Id.sig");
  res.redirect("/login");
});

//-------------------------------------------------------------------------

app.get("/urls/:shortURL", (req, res) => {
  
  const id = req.session.user_Id;
  const user = users[id];
  const shortURL = req.params.shortURL;
  

  if (!urlDatabase[shortURL]) {
    res.status(404).send("Your URL cannot be found");
    return;
  }

  const longURL = urlDatabase[shortURL].longURL;
  const owner = urlDatabase[shortURL]['userID']

  if (!id) {
    res.status(403).send("You are not logged in");
    return;
  }

  if (id !== owner) {
    res.status(403).send("You do not have the required access to view this page");
    return;
  }
  
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: id,
  };

  let visitCount = 0;
  let uniqueVists = 0;
  let visitLog = {};

  //Calculates the analytics to dispaly on page (total visits, unique visits, visits history for the requested URL)
  for (let sUrl in visitsDb) {
    if (sUrl === shortURL) {
      visitLog = visitsDb[sUrl];
      for (let visitor in visitsDb[sUrl]) {
        visitCount += visitsDb[sUrl][visitor].length;
        uniqueVists += 1;
      }
    }
  }

  const templateVars = {
    user: user,
    shortURL: shortURL,
    longURL: longURL,
    timesVisited: visitCount,
    uniqueV: uniqueVists,
    roster: visitLog,
  };

  res.render("urls_show", templateVars);
});

//-------------------------------------------------------------------------

app.get("/u/:shortURL", (req, res) => {
 
  const shortURL = req.params.shortURL;
  

  if (!urlDatabase[shortURL]) {
    res.status(404).send("Your URL cannot be found");
    return;
  }

  const longURL = urlDatabase[shortURL].longURL;
  let id = req.session.user_Id;

  //checks if the visitor is an exisiting user, if not generates a visitor ID
  if (!id) {
    const userID = helpers.generateRandomString();
    req.session.visitor_Id = userID;
    id = userID;
  }

  let stamp = moment(Date.now()).format("MMM Do, YYYY");


  // Logs a record (user/visitor ID and timestamp of visit) to the visits database for analytic purposes
  if (visitsDb[shortURL]) {
    if (visitsDb[shortURL][id]) {
      visitsDb[shortURL][id].push(stamp);
    } else {
      visitsDb[shortURL][id] = [stamp];
    }
  } else {
    visitsDb[shortURL] = {
      [id]: [stamp],
    };
  }

 
  res.redirect(longURL);
});

//-------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
