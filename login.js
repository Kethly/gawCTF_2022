
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

//var email = "keth"
var loginbuttonwidth;
window.onload = (event) => {
  console.log("hi");
  loginbuttonwidth = document.getElementById("loginbtn").clientWidth;
  document.getElementById("loginbtn").style.width = ((loginbuttonwidth).toString() + "px").toString();
  
  
};

function setLoad(){
    document.getElementById("loginbtn").disabled = true;
    document.getElementById("loginbtn").style.width = ((loginbuttonwidth * 0.7).toString() + "px").toString();
    document.getElementById("logintext").hidden = true;
    
    document.getElementById("loginspin").hidden = false;
}
function resetLogin(){
  
  return new Promise((resolve) => {
    console.log("testing");
    document.getElementById("loginbtn").disabled = false;
    document.getElementById("logintext").hidden = false;
    document.getElementById("loginspin").hidden = true;
    document.getElementById("loginbtn").style.width = ((loginbuttonwidth).toString() + "px").toString();
    resolve();
  });

}
function handleErrors(response){
  if (!response.ok) {
    throw Error(response.statusText);
  } 
  return response;
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
    var responseText;
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
      }).then(handleErrors)
      .then(response => 
        //successful response
        response.json()
        //console.log(response.json());
      ).then(data=>
        responseText = data
      ).catch(error =>{
        //edit this part to get a different response when there is an error from the server such as a timeout.
        responseText = JSON.stringify(-1);
        console.log(error);
      }

      );
   //var responseText = await login.json();
   console.log(responseText);
   
    await sleep(500);
    if(responseText === "" || responseText < 0 || responseText.toString().indexOf("Error") > 0){
        // console.log("going to show the failure toast");
        $('#alert-fail').toast('show');
        console.log("login.js got this from auth: " +  responseText);
        resetLogin();
        
    } else {
        
        $('#alert-success').toast('show');
        setCookie("email", email, 31);
        setCookie("password", password, 31);
        setCookie("userId", responseText, 31);
        await sleep(500);
        window.location.replace("/index.html");
    }
}
