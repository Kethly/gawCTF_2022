// this function is being used to test the program
// it is not needed otherwise
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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

let testInputId = 'inputBox2'; //question ids start at 0
// let testSubmission = '-1470554952';
let testSubmission = 'ilovecats';
let testUser = 'Firefox';
let testPassword = 'aaaaa';
let testUserId = 4;

setCookie("username", testUser, 31);
setCookie("password", testPassword, 31);
setCookie("userId", testUserId, 31);

// this program is expected to be used after a person logs in

async function authCookies(inputBoxId){
    // inputBoxId should be the id of the element calling this function
    console.log(inputBoxId);
    username = getCookie("username");
    password = getCookie("password");
    userId = getCookie("userId");
    var verify = await fetch("/api/authCookies", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            userId: userId
        })
    });
    var response = await verify.json();
    console.log(response);
    if(response){
        // the user authentication was successful
        // get the flag submission from the input box
        console.log("user auth with cookies was successful");
        var submission = document.getElementById(inputBoxId).getElementsByClassName('form-control')[0].value;
        console.log("here is the submitted flag:");
        console.log(submission);
        // console.log(document.getElementById(inputBoxId).getElementsByClassName('form-control'));
        
        // checkFlag also updates the spreadsheet with the new flag submission
        var flagCheck = await fetch("/api/checkFlag", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                submission: submission,
                userId: userId,
                inputBoxId: inputBoxId
            })
        });
        var flagResponse = await flagCheck.json();
        if(flagResponse){
            // flag was correct
            console.log("The flag was correct, congrats!");
        }
        else{
            // flag was incorrect
            console.log("The flag was incorrect!");
        }
    }
    else{
        // the user authentication was unsuccessful
    }
}