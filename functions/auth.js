var username = "keth"
var email = "kethlyfast@gmail.com"
var password = "password123"
let values = [
  [username,
  password,
  email
  ]
];
let testresult = 0;

exports.handler = async (event, context) => {
  let params = JSON.parse(event.body)
  let email = params.email;
  let password = params.password;
    return { statusCode: 200, body: JSON.stringify("s"), };
};
