// This file will get the user-inputted flag
// check the flag and return true if the flag is correct, false if incorrect
// Also write the flag submission to the database

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

function checkFlag(inputBoxId, submission){
    /*  inputBoxId should be in the format
        inputBox0, inputBox1...etc
        the number should be the id number of the question
        inputBoxId should be the id of the element which calls the function

        submission is the flag, not hashed, the user submitted
        
        This function will return a promise
        Promise response is true if the flag is correct
        false if the flag is incorrect
        reject with an error if the API returns an error
    */
    return new Promise(function(resolve, reject){
        let spreadsheetId = '15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0';
        let sheetRange = 'flags!A2:D2';
        let sheets = google.sheets('v4');

        sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: sheetRange
        }, function(err, response){
            if(err){
                // handle the error
                console.log("checkFlag: The API returned an error when checking the flag: " + err);
                reject(err);
                return;
            }
            else{
                console.log("checkFlag got this data: " + response.data.values);
                // all hashes are in the first row
                // calculate the column number
                var colnum = parseInt(inputBoxId.replace(/\D/g, ""), 10);
                console.log("checkFlag is checking against this flag hash: " + response.data.values[0][colnum]);
                
                // compare the hashes to determine if the flag was correct
                if(submission.hashCode().toString() === response.data.values[0][colnum]){
                    console.log("checkFlag: The flag is correct!");
                    resolve(true);
                    return;
                }
                else{
                    console.log("checkFlag: The flag is incorrect!");
                    resolve(false);
                    return;
                }
            }
        });
    });
}


function getColCode(questionId){
    // This function is to be used in writeSubmission()
    // determine the columnId (eg. A, B, AA, etc)
    // based on the questionIds, which are integers starting from 0
    // 27 column is AA, 28th is AB...

    // questionId is an integer, Ids are assigned starting from 0 in the html

    // this function only works if the column code is 2 letters long
    var colCode = "";

    // questionIds start at 0, but the actual data starts at column B
    questionId += 1;
    // ascii code for A is 65
    colCode += String.fromCharCode(questionId%26+65);
    if(questionId >= 26){
        colCode = String.fromCharCode(questionId/26-1+65) + colCode;
    }
    return colCode;
}

function writeSubmission(inputBoxId, userId, submission){
    /*  inputBoxId should be in the format
        inputBox0, inputBox1...etc
        the number should be the id number of the question
        inputBoxId should be the id of the element which calls the function

        submission is the flag, not hashed, the user submitted
        
        This function will not return anything
        This function will update the user-submitted flag
        to the submits sheet on the private database 
    */
    var questionId = parseInt(inputBoxId.replace(/\D/g, ""), 10);

    let spreadsheetId = '15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0';
    let sheetRange = 'submits!'+getColCode(questionId)+userId+':'+getColCode(questionId)+userId;
    let sheets = google.sheets('v4');
    let values = [[submission.hashCode()]];
    const sheetResource = {values};

    console.log("writeSubmission: This is the sheetRange: " + 'submits!'+getColCode(questionId)+userId+':'+getColCode(questionId)+userId);

    sheets.spreadsheets.values.update({
        auth: jwtClient,
        valueInputOption: "RAW",
        spreadsheetId: spreadsheetId,
        range: sheetRange,
        resource: sheetResource
    }, function(err, response){
        if(err){
            console.log("writeSubmission: The API returned an error when updating submits: " + err);
        }
        else{
            console.log("writeSubmission: The flag submission updated to the sheet successfully");
            console.log(submission.hashCode());
        }
    });
}

// need the following parameters
// submission (flag)
// userId
// inputBoxId
exports.handler = async(event, context) => {
    let params = JSON.parse(event.body);
    let submission = params.submission;
    let userId = params.userId;
    let inputBoxId = params.inputBoxId;
    console.log("checkFlag.js receieved these parameters: ");
    console.log("submission:" + submission);
    console.log("userId:" + userId);
    console.log("inputBoxId:" + inputBoxId);
    
    let result = await checkFlag(inputBoxId, submission);
    console.log("checkFlag.js result: " + result);
    writeSubmission(inputBoxId, userId, submission);
    return {statusCode: 200, body: JSON.stringify(result)};
}