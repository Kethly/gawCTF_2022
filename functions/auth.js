/*  This program return the row of the user data in the sheets (userID)
    If authentication failed, it returns -1
*/

var { google } = require("googleapis")
const {JWT} = require('google-auth-library');
let secretKey = require("./client_secret.json");

let jwtClient = new JWT(
       secretKey.client_email,
       null,
       secretKey.private_key,
       ['https://www.googleapis.com/auth/spreadsheets']);

//hashing algorithm js thank you online stack overflow
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

//authenticate request
jwtClient.authorize(function (err, tokens) {
 if (err) {
   console.log(err);
   return;
 } else {
   //console.log("Successfully connected!");
 }
});

function authUser(email, password){
  // returns -1 if the user authentication failed
  // returns the row of the user's data in the spreadsheet if user auth was a success
  return new Promise(function(resolve, reject){
    let spreadsheetId = '15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0';
    let sheets = google.sheets('v4');

    let sheetRange = 'Users!A2:D';

    //Grab the current users for login
    let current_users = [];
    sheets.spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: spreadsheetId,
    range: sheetRange
    }, function (err, response) {
      if (err) {
          console.log('AuthUser: The API returned an error: ' + err);
          reject(err);
          return;
      } 
      else { 
        for(let row in response.data.values){
            if(response.data.values[row][0]){
            current_users.push(response.data.values[row][0].toString().toLowerCase());
            }  
        }

        let index = current_users.indexOf(email.toLowerCase());
        console.log("authUser: found user at row: " + (index+2) + "when comparing to: " + email.toString().toLowerCase());
        if(!(index > 0)){
            console.log("AuthUser: you don't exist....");
            resolve(-1);
        } 
        else {
          console.log("authUser: comparing to hash: " + response.data.values[index][1]);
          if(!(password.hashCode() == response.data.values[index][1])){
              console.log("AuthUser: wrong password, please log out, and log in again");
              resolve(-1);
          } 
          else {

              console.log("AuthUser: successful login!");
              console.log("email:", response.data.values[index][0]);
              console.log("password:", password);
              resolve(index+2);
          }
        }
      }
    });
  });
}

exports.handler = async (event, context) => {
  let params = JSON.parse(event.body);
  let email = params.email;
  let password = params.password;
<<<<<<< HEAD
  console.log("Auth.js received the following parameters:");
  console.log("email: " + email);
  console.log("password: " + password);
  console.log("Password hash is: " + password.hashCode());
  let userId = await authUser(email, password);
  console.log("Auth.js computed a userId: " + userId);

  // userId is -1 if the user authentication was not successful
  return { statusCode: 200, body: JSON.stringify(userId)};
=======
    return { statusCode: 200, body: JSON.stringify(""), };
>>>>>>> newuserstaterecovered
};
