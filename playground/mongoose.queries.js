const mongoose = require('../server/db/mongoose').mongoose;
const Todo = require('../server/models/todo').Todo;
const User = require('../server/models/user').User;
const ObjectId = require('mongodb').ObjectId;

var id = '5aebbdd6f9475dfc2636705e';
var userId = '5aea7c16cae51db028ed3060';

if(!ObjectId.isValid(id)){
  console.log('id not valid');
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log(todos);
});

Todo.findOne({
    completed: false
}).then((todo) => {
    console.log('todo', todo);
});

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('id not found!');
    }
    console.log('todo by id', todo);
}).catch((error)=>{
    console.log(error);
});

User.findById(userId).then((user)=>{
    if(!user){
        return console.log('user not found');
    }
    console.log('found user is',JSON.stringify(user,undefined,2));
}).catch((error)=>{
    console.log(error);
})