var token = process.env.TOKEN;
const fetch = require('node-fetch');
//googleapis
const { google } = require("googleapis");
async function upload(){
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
  var path = "1XBd9iby84O-jNv0Wuvzewtm9ZKyEn87NpFmSIy-8HVA";
  var read = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}/?key=${token}`);
  var values = await read.response();
  console.log(values);
}
upload();
