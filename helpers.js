
function generateRandomString() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function emailValidate(attEmail, obj) {
  for (let num in obj) {
    if (obj[num]["email"] === attEmail) {
      return true;
    }
  }
  return false;
}

function loginValidate(Email, Password, obj) {
  for (let userT in obj) {
    if (
      obj[userT]["email"] === Email &&
      obj[userT]["password"] === Password
    ) {
      return obj[userT]["id"];
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

function urlsForUser(id , dbObj) {

  let obj = {};
 for (let num in dbObj) {

   if (dbObj[num]["userID"] === id) {

     obj[num] = dbObj[num]
 
   }
 }
   return obj
}

module.exports = { emailValidate, loginValidate, checkBlanks, generateRandomString, urlsForUser}