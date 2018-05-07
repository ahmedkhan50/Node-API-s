const ObjectId = require('mongodb').ObjectId;
const Todo = require('../../models/todo').Todo;
const User = require('../../models/user').User;
const jwt = require('jsonwebtoken');
const user1_id = new ObjectId();
const user2_id = new ObjectId();
const users = [
    {
        _id: user1_id,
        email: 'akhan1@tw.com',
        password: '123456',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: user1_id.toHexString(), access: 'auth' }, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: user2_id,
        email: 'akhan2@tw.com',
        password: '123456',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: user2_id.toHexString(), access: 'auth' }, process.env.JWT_SECRET).toString()
            }
        ]
    }
]

const todos = [
    { text: 'test to do', _id: new ObjectId(), _creator: user1_id},
    { text: 'this is great!!', _id: new ObjectId(), completed: true, completedAt: 222, _creator:user2_id }
]

const populateToDos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then((res) => done());
}

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var user1= new User(users[0]).save();
        var user2= new User(users[1]).save();

        return Promise.all([user1,user2])
        .then(()=>done());
    });
}

module.exports = {
    todos: todos,
    populateToDos: populateToDos,
    users:users,
    populateUsers:populateUsers
}