function generateRandomString() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function emailValidate(attemptEmail, usersDatabase) {
  for (let shortURl in usersDatabase) {
    if (usersDatabase[shortURl]["email"] === attemptEmail) {
      return true;
    }
  }
  return false;
}

function loginValidate(Email, Password, usersDatabase) {
  for (let shortURl in usersDatabase) {
    if (
      usersDatabase[shortURl]["email"] === Email &&
      usersDatabase[shortURl]["password"] === Password
    ) {
      return usersDatabase[shortURl]["id"];
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

// Pulls out the list of URLs for the logged in User
function urlsForUser(userId, URLDatabase) {
  let URLs = {};
  for (let indexnumber in URLDatabase) {
    if (URLDatabase[indexnumber]["userID"] === userId) {
      URLs[indexnumber] = URLDatabase[indexnumber];
    }
  }
  return URLs;
}

module.exports = {
  emailValidate,
  loginValidate,
  checkBlanks,
  generateRandomString,
  urlsForUser,
};
