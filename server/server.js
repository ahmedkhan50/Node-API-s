require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose').mongoose;
const Todo = require('./models/todo').Todo;
const User = require('./models/user').User;
const authenticate = require('./middleware/authenticate').authenticate;
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');
const port = process.env.PORT;
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

// find todo by Id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Todo.findById(id).then((todo) => {
            if (!todo) {
                return res.status(404).send('no results for todo id');
            }
            res.send({ todo: todo });
        }).catch((error) => {
            return res.status(404).send('no results for todo id');
        })
    }
    else {
        return res.status(404).send({ error: 'not a valid object id...' });
    }
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Todo.findByIdAndRemove(id).then((todo) => {
            if (!todo) {
                return res.status(404).send('no results for todo id');
            }
            res.send({ todo: todo });
        }).catch((error) => {
            return res.status(404).send('no results for todo id');
        });
    }
    else {
        return res.status(404).send({ error: 'not a valid object id...' });
    }
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectId.isValid(id)) {
        return res.status(404).send({ error: 'not a valid object id...' });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    },
        {
            new: true
        }
    ).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo: todo });
    }).catch((error) => {
        res.status(400).send();
    })
});

// post user request
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    })
        .catch((error) => {
            res.status(400).send(error);
        })
});

// post route for loggin user
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredential(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports.app = app;

