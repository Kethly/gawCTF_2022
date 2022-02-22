
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

var username = "keth"
var loginbuttonwidth;
window.onload = (event) => {
  
  loginbuttonwidth = document.getElementById("loginbtn").clientWidth;
  console.log("hi")
};

function setLoad(){
    document.getElementById("loginbtn").disabled = true;
    
    document.getElementById("loginbtn").style.width = ((loginbuttonwidth * 0.7).toString() + "px").toString();
    document.getElementById("logintext").innerText ="";
    
    document.getElementById("loginspin").hidden = false;
}
function resetLogin(){
  
  return new Promise((resolve) => {
    console.log("testing");
    document.getElementById("loginbtn").disabled = false;
    document.getElementById("logintext").innerText ="Login";
    document.getElementById("loginspin").hidden = true;
    document.getElementById("loginbtn").style.width = ((loginbuttonwidth).toString() + "px").toString();
    resolve();
  });

}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function auth(){
    setLoad();
    
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
    await sleep(1000);
    if(response === ""){
        $('#alert-fail').toast('show');
        resetLogin();
        
    } else {
        
        $('#alert-success').toast('show');
        setCookie("username", username, 31);
        setCookie("email", email, 31);
        setCookie("password", password, 31);
    }
}
