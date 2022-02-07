async function getScoreboard(){
  var publicdata = await fetch("https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit");
  var responses = await publicdata.json();
  var display = "";
  for(var i = 0; i < Object.keys(responses).length; i++){
    display += JSON.stringify(responses[i]) + "\n";
  }
  document.getElementById("scoreboard").innerHTML = display;
}
