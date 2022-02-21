/* client should pass the cookies
    cookies:
        username (string)
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

function compareCookies(username, password, userId){
    /* Check the user credentials (username and password)
       if the user credentials are not valid, display an error message
       return a promise with response value true if the credentials are valid
       false if the credentials are invalid
       promise will reject with an error if the API returns an error

       uses the cookies username, password, and userId
       userId should be the row of the user's data in the sheet, starting with row 2
    */

    return new Promise(function(resolve, reject){
        // if the cookies have no value, then user auth fails
        if(!username || !password || !userId){
            console.log("User authentication failed! Cookies are invalid");
            resolve(false);
            return;
        }

        // read from the sheet
        let spreadsheetId = '15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0';
        let sheets = google.sheets('v4');
        let sheetRange = 'Users!A'+userId+':D'+userId;
        console.log(sheetRange);
        sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: sheetRange,
        }, function(err, response){
            if(err){
                console.log('The API returned an error during cookie authentication: ' + err);
                reject(err);
                return;
            }
            else{
                // usernames are in the first column
                // password hashes are in the second column
                console.log(response.data.values);
                console.log(password.hashCode());
                if((response.data.values[0][0] === username) 
                    && (response.data.values[0][1] === password.hashCode().toString())){
                        console.log('User cookie authentication successful!');
                        resolve(true);
                        return;
                }
                console.log("User cookie authentication failed! oh noes");
                console.log(response.data.values[0][1]);
                console.log(password.hashCode());
                if(!(response.data.values[0][0] === username)){
                    console.log("Username does not match");
                }
                // console.log('the program gets to line 126');
                if(!(response.data.values[0][1] === password.hashCode().toString())){
                    console.log("Password does not match");
                    console.log(password.hashCode() + response.data.values[0][1]);
                }
                // console.log('the program gets here to line 131');
                resolve(false);
                return;
            }
        });
    });
}

exports.handler = async(event, context) => {
    let params = JSON.parse(event.body);
    let username = params.username;
    let password = params.password;
    let userId = params.userId;
    console.log(username);
    console.log(password);
    console.log(userId);
    let result = await compareCookies(username, password, userId);
    console.log(result);
    return {statusCode: 200, body: JSON.stringify(result)};
}