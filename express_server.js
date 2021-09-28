const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]} ;
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase,  username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase ,  username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  let longURL = req.body["longURL"]
  if(!longURL.includes("http://")){
      longURL = "http://" + longURL
  }
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  // console.log(shortURL)
  res.redirect("/urls/"+shortURL);
});

app.post("/login", (req, res) => {
  const UserID = req.body.username;
   res.cookie("username", UserID)
  res.redirect("/urls");
});

app.post("/edit", (req, res) => {
  let editURL = req.body.editURL;
  const shortURL = req.body.shURL
  if(!editURL.includes("http://")){
      editURL = "http://" + editURL
  }
   urlDatabase[shortURL] = editURL
   res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.clearCookie("username", templateVars.username)
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL],  username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




function generateRandomString() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
