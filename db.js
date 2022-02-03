async function receivedata(){
test = await fetch(f"https://sheets.googleapis.com/v4/spreadsheets/1XBd9iby84O-jNv0Wuvzewtm9ZKyEn87NpFmSIy-8HVA/values/A1?key={process.env.TOKEN}");
resp = await test.json();
console.log(resp);
}
receivedata();
