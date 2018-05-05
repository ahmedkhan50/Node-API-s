const mongoose = require('../server/db/mongoose').mongoose;
const Todo = require('../server/models/todo').Todo;
const User = require('../server/models/user').User;
const ObjectId = require('mongodb').ObjectId;


// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({})
Todo.findByIdAndRemove('5aed0a163e0eafa947c2e5fe').then((todo)=>{
   console.log(todo);
});