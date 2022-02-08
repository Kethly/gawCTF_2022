async function getScoreboard(){
  var publicdata = await fetch("https://opensheet.elk.sh/1XBd9iby84O-jNv0Wuvzewtm9ZKyEn87NpFmSIy-8HVA/scoreboard");
  var responses = await publicdata.json();
  var display = "";
  for(var i = 0; i < Object.keys(responses).length; i++){
    display += JSON.stringify(responses[i]) + "\n";
    console.log(JSON.stringify(responses[i]) + "\n");

    // add a row to the table with the scores
    // adding into the tbody of the table
    var tBody = document.getElementById("scoreboard").getElementsByTagName("tbody")[0];
    var newRow = tBody.insertRow();
    var usercell = newRow.insertCell(0);
    var scorecell = newRow.insertCell(1);
    usercell.innerHTML = responses[i]["user"];
    scorecell.innerHTML = responses[i]["score"];

    // const scoreitem = document.createElement("p");
    // const node = document.createTextNode(responses[i]["user"] + " " + responses[i]["score"]);
    // scoreitem.appendChild(node);
    // scoreitem.id = responses[i]["user"];
    // document.getElementById("scoreboard").appendChild(scoreitem);
  }
  
}
getScoreboard();
