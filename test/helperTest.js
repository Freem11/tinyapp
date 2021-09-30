const { assert } = require("chai");

const { emailValidate } = require("../helpers.js");
const { loginValidate } = require("../helpers.js");
const { checkBlanks } = require("../helpers.js");
const { urlsForUser } = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

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

describe("urlsForUser", function () {
  it("returns true if longURL of returned object and expected longURL value match based on supplied email address", function () {
    const URls = urlsForUser("userRandomID", urlDatabase);
    const expected = "http://www.lighthouselabs.ca";

    assert.equal(URls["b2xVn2"].longURL, expected);
  });
  it("returns empty obj length if no URLs are attached to the user email supplied", function () {
    const URls = urlsForUser("test@test.com", urlDatabase);
    const expected = "http://www.google.com";

    assert.equal(Object.keys(URls), 0);
  });
});

describe("emailValidate", function () {
  it("returns true if the email address already exists in the users list", function () {
    const user = emailValidate("user@example.com", testUsers);
    assert.equal(user, true);
  });
  it("returns false if the email address does not exists in the users list", function () {
    const user = emailValidate("freem1985@gmail.com", testUsers);
    assert.equal(user, false);
  });
});

describe("loginValidate", function () {
  it("returns id of the user if email and password are found in the users list", function () {
    const id = loginValidate("user2@example.com", "dishwasher-funk", testUsers);
    assert.equal(id, "user2RandomID");
  });
  it("returns false if the user if email and password are found in the users list", function () {
    const id = loginValidate("freem1985@gmail.com", "abelincon", testUsers);
    assert.equal(id, false);
  });
});

describe("checkBlanks", function () {
  it("returns yes if the email or passoword are left blank (both blank)", function () {
    const id = checkBlanks("", "");
    assert.equal(id, "yes");
  });
  it("returns yes if the email or passoword are left blank (email blank)", function () {
    const id = checkBlanks("", "abelincon");
    assert.equal(id, "yes");
  });
  it("returns yes if the email or passoword are left blank (password blank)", function () {
    const id = checkBlanks("freem1985@gmail.com", "");
    assert.equal(id, "yes");
  });
  it("returns no if both the email and passoword are found supplied", function () {
    const id = checkBlanks("freem1985@gmail.com", "abelincon");
    assert.equal(id, "no");
  });
});
