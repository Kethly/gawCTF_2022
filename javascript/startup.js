/*this file will have the default checks for each page, for example checking for cookies to see if to apply log out
checking to see if they have a username or email to personalize the page for them etc*/
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;'; 
}
var userId;
var password;
var email;
function checkLogin(){
    email = getCookie("email");
    password = getCookie("password");
    userId = getCookie("userId");
    if(email && password && userId){ //note, this may be better to process clientwise instead of in authCookies in order to prevent people from spamming empty cookies
        var logout = document.getElementById("logswitch");
        logout.textContent = "Logout";
        logout.addEventListener("click", () => {
            eraseCookie("email");
            eraseCookie("password");
            eraseCookie("userId");
        });
        logout.href = "login";
    }
}

window.onload = function() {
    checkLogin();
  };