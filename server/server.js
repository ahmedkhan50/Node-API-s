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
app.post('/todos', authenticate, (req, res) => {
    var toDo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt,
        _creator: req.user._id
    });

    toDo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        // status 400 is bad input...
        res.status(400).send(error);
    })

});
// get request to get all todos. 
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos: todos });
    });
}, (error) => {
    res.status(400).send(error);
});

// find todo by Id
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectId.isValid(id)) {
        Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, {
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

// post user request to add new user/create account.
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

// post route for logging in user
app.post('/users/login', async (req, res) => {
    try {
        var body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredential(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    }
    catch (e) {
        res.status(400).send();
    }
});

// logout route
app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send();
    }
});

// get method to get user. 
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports.app = app;

