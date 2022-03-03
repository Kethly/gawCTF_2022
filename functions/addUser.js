var { google } = require("googleapis")
const {JWT} = require('google-auth-library');
let secretKey = {"client_email": process.env.client_email.replace(/\\n/gm, "\n"), "private_key": process.env.private_key.replace(/\\n/gm, "\n")};


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
function adduser(newuser, newemail, newpassword){
//Google Sheets API
return new Promise(function(resolve, reject){
    if(newuser === "" || newemail === "" || newpassword === ""){
        //wow, an empty user, password, and email :0
        console.log("empty fields... really...")
        resolve(-1);
    }
    let spreadsheetId = '15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0';
    let sheetRange = 'Users!A2:D'
    let sheets = google.sheets('v4');

    //Grab the current users for login
    let current_users = [];
    let current_emails = [];
    sheets.spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: spreadsheetId,
    range: sheetRange
    }, function (err, response) {
    if (err) {
        console.log('The API returned an error: ' + err);
    } else {
        //get each username and shove it into current_users
        for(let row in response.data.values){
            if(response.data.values[row][0]){
            current_users.push(response.data.values[row][0].toString().toLowerCase());
            }
            if(response.data.values[row][3]){
            current_emails.push(response.data.values[row][3].toString().toLowerCase());
            }
            }
        //console.log(current_emails)
        //console.log(current_users);
        //then try and add new user if usernames does not match another person
        if(!current_users.includes(newuser.toString().toLowerCase())){
            if(!current_emails.includes(newemail.toString().toLowerCase()))
            {
                
                newpasswordhashed = newpassword.hashCode();
                let values = [
                    [newemail,
                    newpasswordhashed,
                    0,
                    newuser
                    ]
                ];
                
                const sheetResource = {
                    values,
                };
                
                sheets.spreadsheets.values.append({
                    auth: jwtClient,
                    valueInputOption: "RAW",
                    insertDataOption: "INSERT_ROWS",
                    spreadsheetId: spreadsheetId,
                    range: sheetRange,
                    resource: sheetResource
                }, function (err, response) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        resolve(-1);
                    } else {
                        //should respond that there was some sort of success and we'll use this for the toast
                        console.log("Users: " + newuser + " was added successfully");
                        resolve(current_users.length+1);
                    }
                });
            } else {
                console.log("this email already exists, are you trying to hack someone...")
                resolve(-1);
            }
            
        
        
        } else {
            //should respond that there was some sort of failure and use toast for failure?
            console.log("this user already exists!! What are you doing!?!?!")
            resolve(-1);
        }
    }
    });
});


}
exports.handler = async (event, context) => {
    let params = JSON.parse(event.body);
    let user = params.name;
    let email = params.email;
    let password = params.password;
    let returnValue = await adduser(user, email, password);
    //returns userId by doing current_users list and adding 1 to it.
    return { statusCode: 200, body: JSON.stringify(returnValue)};
};

