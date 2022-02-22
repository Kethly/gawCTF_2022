/* client should pass the cookies
    cookies:
        email (string)
        password (unhashed string)
        userId (integer, row number of the user data on the sheet)
    this file will check if the cookies contain valid user data
    return a json with true for cookies are valid
    false if cookies are invalid
*/

var {google} = require("googleapis");
const {JWT} = require("google-auth-library");
let secretKey = require("./client_secret.json");
const { testing } = require("googleapis/build/src/apis/testing");
const { sheets } = require("googleapis/build/src/apis/sheets");

let jwtClient = new JWT(
    secretKey.client_email,
    null,
    secretKey.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
);

//hashing algorithm 
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

// Authenticate request
jwtClient.authorize(function(err, tokens){
    if(err){
        console.log(err);
        return;
    }
    else{
        console.log("Successfully connected!");
    }
});

function compareCookies(email, password, userId){
    /* Check the user credentials (email and password)
       if the user credentials are not valid, display an error message
       return a promise with response value true if the credentials are valid
       false if the credentials are invalid
       promise will reject with an error if the API returns an error

       uses the cookies email, password, and userId
       userId should be the row of the user's data in the sheet, starting with row 2
    */

    return new Promise(function(resolve, reject){
        // if the cookies have no value, then user auth fails
        if(!email || !password || !userId){
            console.log("compareCookies: User authentication failed! Cookies are invalid");
            resolve(false);
            return;
        }

        // read from the sheet
        let spreadsheetId = '15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0';
        let sheets = google.sheets('v4');
        let sheetRange = 'Users!A'+userId+':D'+userId;
        console.log("compareCookies is looking in this sheetrange: " + sheetRange);
        sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: sheetRange,
        }, function(err, response){
            if(err){
                console.log('compareCookies: The API returned an error during cookie authentication: ' + err);
                reject(err);
                return;
            }
            else{
                // emails are in the first column
                // password hashes are in the second column
                console.log("compareCookies got this response data: " + response.data.values);
                console.log("compareCookies: password cookie hash is: " + password.hashCode());
                if((response.data.values[0][0] === email) 
                    && (response.data.values[0][1] === password.hashCode().toString())){
                        console.log('compareCookies: User cookie authentication successful!');
                        resolve(true);
                        return;
                }
                console.log("compareCookies: User cookie authentication failed! oh noes");
                console.log("compareCookies: this is the correct password hash: " + response.data.values[0][1]);
                if(!(response.data.values[0][0] === email)){
                    console.log("compareCookies: Email does not match");
                }
                if(!(response.data.values[0][1] === password.hashCode().toString())){
                    console.log("compareCookies: Password does not match");
                }
                resolve(false);
                return;
            }
        });
    });
}

exports.handler = async(event, context) => {
    let params = JSON.parse(event.body);
    let email = params.email;
    let password = params.password;
    let userId = params.userId;
    console.log("authCookies.js receieved the following parameters:");
    console.log("email: " + email);
    console.log("password: " + password);
    console.log("userId: " + userId);
    let result = await compareCookies(email, password, userId);
    console.log("authCookies.js determined this result: " + result);
    return {statusCode: 200, body: JSON.stringify(result)};
}