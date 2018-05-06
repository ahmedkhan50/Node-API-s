const jwt = require('jsonwebtoken');

// jwt.sign() - > takes object and signs it and creates token and returns
// jwt.verify() -> takes token and secret and makes sure was not manipulated.


var data ={
    id:10
}

var token = jwt.sign(data,'123abc');

console.log(token);

var decoded = jwt.verify(token,'123abcc');

console.log('decoded',decoded);
