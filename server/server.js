const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo').Todo;
const User = require('./models/user').User;

const app = express();

app.use(bodyParser.json());
// post request to save todos. 
app.post('/todos', (req, res) => {
    var toDo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });

    toDo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        // status 400 is bad input...
        res.status(400).send(error);
    })

});
// get request to get all todos. 
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos: todos });
    });
}, (error) => {
    res.status(400).send(error);
});

app.listen(3000, () => {
    console.log('started on port 3000');
});

module.exports.app = app;

