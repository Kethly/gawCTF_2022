async function getScoreboard(){
  var publicdata = await fetch("https://opensheet.elk.sh/1XBd9iby84O-jNv0Wuvzewtm9ZKyEn87NpFmSIy-8HVA/scoreboard");
  var responses = await publicdata.json();
  var display = "";
  for(var i = 0; i < Object.keys(responses).length; i++){
    display += JSON.stringify(responses[i]) + "\n";
    console.log(JSON.stringify(responses[i]) + "\n");
    const scoreitem = document.createElement("p");
    const node = document.createTextNode(responses[i]["user"] + " " + responses[i]["score"]);
    scoreitem.appendChild(node);
    scoreitem.id = responses[i]["user"];
    document.getElementById("scoreboard").appendChild(scoreitem);
  }
  
}
getScoreboard();
