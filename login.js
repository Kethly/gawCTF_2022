
async function auth(){

    var email = document.getElementById("typeEmailX").value;
    var password = document.getElementById("typePasswordX").value;
    var login = await fetch("/api/auth", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      
        //make sure to serialize your JSON body
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
    var response = await login.json();
    console.log(response);
    if(response === ""){
        $('#alert-fail').toast('show');
    } else {
        
        $('#alert-success').toast('show');
    }
}
