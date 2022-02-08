var token = process.env.TOKEN;
const fetch = require('node-fetch');
//googleapis
const { google } = require("googleapis");
exports.handler = async (event, context) => {
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
  var path = "15VYcKvXIXfGaLPMzBojLMOnt-ajWn505lNzWwTmNoD0";
  var read = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}/?key=${token}`);
  var values = await read.json();
return { statusCode: 200, body: JSON.stringify(values), };
};
