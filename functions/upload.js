var token = process.env.TOKEN;
const fetch = require('node-fetch');
//googleapis
const { google } = require("googleapis");
exports.handler = async (event, context) => {
  let jwtClient = new google.auth.JWT(
       process.env.client_email,
       null,
       process.env.private_key,
       ['https://www.googleapis.com/auth/spreadsheets']);
//authenticate request
  var test = "hello";
await jwtClient.authorize(function (err, tokens) {
 if (err) {
   test = err;
   return;
 } else {
   test = "Successfully connected!";
 }
});
//Google Sheets API
let spreadsheetId = process.env.path;
let sheetRange = 'Users!A1:C'
let sheets = google.sheets('v4');

await sheets.spreadsheets.values.get({
   auth: jwtClient,
   spreadsheetId: spreadsheetId,
   range: sheetRange
}, function (err, response) {
   if (err) {
       console.log('The API returned an error: ' + err);
   } else {
       console.log('Movie list from Google Sheets:');
     //test = responpse.values;
       for (let row of response.values) {
           //test.push('Title [%s]\t\tRating [%s]' + " " + row[0] + " "+ row[1]);
       }
   }
});
return { statusCode: 200, body: JSON.stringify(test), };
};
