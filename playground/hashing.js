const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

// var message = 't addss sdssd';
// var hash = SHA256(message).toString();

// console.log(`message is ${message}`);
// console.log(`Hash is ${hash}`);

// var data = {
//     id: 4
// }

// var token = {
//     data:data,
//     hash: SHA256(JSON.stringify(data+'somesecret')).toString()
// }

// someone at client tried to change to id and hash to hacking..
// token.data.id = 5;
// token.data.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();



// if(resultHash == token.hash){
//     console.log('token not changed!');
// }
// else{
//     console.log('token changed!! Do not trust!');
// }

// bcrypt js algorithm to hash password...

var password ='ahmedkhan50';
bcrypt.genSalt(10,(error,salt)=>{
    bcrypt.hash(password,salt,(error,hash)=>{
        check(hash+'a');
    })
});

const check = (hash)=>{
bcrypt.compare(password,hash,(err,res)=>{
    console.log(res);
});
}


