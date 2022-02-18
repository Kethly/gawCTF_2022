
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

var username = "keth"
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
        setCookie("username", username, 31);
        setCookie("email", email, 31);
        setCookie("password", password, 31);
        window.location.replace("/index.html");
    }
}
