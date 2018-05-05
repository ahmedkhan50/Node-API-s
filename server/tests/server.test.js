const request = require('supertest');
const expect = require('expect');

const app = require('../server').app;
const Todo = require('../models/todo').Todo;
const ObjectId = require('mongodb').ObjectId;

const todos = [
    { text: 'test to do', _id: new ObjectId() }, { text: 'this is great!!', _id: new ObjectId() }
]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then((res) => done());
});

describe('/todos post call test', () => {

    it('it should create a new toDo', (done) => {
        var text = 'it should send data';

        request(app)
            .post('/todos')
            .send({ text: text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                Todo.find({ text: text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(error => done(error));
            })
    });

    it('it should not create todo when invalid data', (done) => {
        var text = '';

        request(app)
            .post('/todos')
            .send({ text: text })
            .expect(400)
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(error => done(error));
            });
    });

});

describe('the get /todos route', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('/get /todo:id', () => {
    it('should return the todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toBe('no results for todo id')
            })
            .end(done);
    });

    it('should return 404 for non object id\'\s', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('not a valid object id...')
            })
            .end(done);
    });
});

describe('/todo delete by id', () => {
    it('should delete valid id', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                })
                    .catch((error) => done(error));
            })
    });

    it('invalid ObjId', (done) => {
        request(app)
            .delete(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toBe('no results for todo id');
            })
            .end(done);
    });

    it('should return 404 for non object id\'\s', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('not a valid object id...')
            })
            .end(done);
    });
});


