/*
The functions used to access the database will be migrated here and then used in files necessary with import or require
This file will export those functions and ipmlement callbacks so that the functions will become much more efficient.
*/
var { google } = require("googleapis")
const {JWT} = require('google-auth-library');
let secretKey = {
    "client_email": (process.env.client_email).replace(/\\n/gm, "\n"), 
    "private_key": (process.env.private_key).replace(/\\n/gm, "\n")
    };

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

function getJWT(){
    //this function will set up the JWT access and return it.
    let jwtClient = new JWT(
        secretKey.client_email,
        null,
        secretKey.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']);
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            return;
        } else {
          //console.log("Successfully connected!");
        }
        }); 
        return jwtClient;
}
//callback defaults to nothing if there isn't anything
function connectToSheets(sheetRange, callback = ()=>{}, ...rest){
    /*connects to sheets using sheetrange, and then passes 
    the code into a callback function that works with that data
    passes other data such as email and etc into the extra values*/
        extraParams = arguments;
    return new Promise(function(resolve, reject){
        jwtClient = getJWT();
        
        let spreadsheetId = '15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0';
        let sheets = google.sheets('v4');
        
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
            resolve(callback(response, ...rest));
        }
        });
    });
}

function authUser(response, email, password){
    // returns -1 if the user authentication failed
    // returns the row of the user's data in the spreadsheet if user auth was a success
    return new Promise(function(resolve, reject){
        let current_users = [];
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
    });
}

//using cookies, cookies 
async function returnValue(){
console.log("final result", await connectToSheets('Users!A2:D', authUser, "kethlyfast@gmail.com", "keth"));
}
returnValue();