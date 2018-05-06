const request = require('supertest');
const expect = require('expect');

const app = require('../server').app;
const Todo = require('../models/todo').Todo;
const User = require('../models/user').User;
const ObjectId = require('mongodb').ObjectId;
const {todos,populateToDos,users,populateUsers} = require('./seed/seed');

beforeEach(populateToDos);
beforeEach(populateUsers);

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
                    expect(todo).toBe(null);
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
                expect(res.body).toBe({});
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

describe('/todos patch with completed true', () => {
    it('should update the todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text: 'i am great!', completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('i am great!');
                expect(res.body.todo.completed).toBeTruthy();
                expect(res.body.todo.completedAt).toBeDefined();
            })
            .end(done);
    });
    it('should clear completed at when todo is not completed', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text: 'sec test@!', completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('sec test@!');
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    })
});

describe('GET users/me',()=>{
    it('should return user if authenticated',(done)=>{
         request(app)
         .get('/users/me')
         .set('x-auth',users[0].tokens[0].token)
         .expect(200)
         .expect((res)=>{
             expect(res.body._id).toBe(users[0]._id.toHexString());
             expect(res.body.email).toBe(users[0].email);
         })
         .end(done);
    });
    it('should return 401 if user not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    })
});

describe('POST users/',()=>{
    it('should create user',(done)=>{
      var email = 'akhan3@tw.com';
      var password = '123456';
      request(app)
      .post('/users')
      .send({email:email,password:password})
      .expect(200)
      .expect((res)=>{
          expect(res.headers['x-auth']).toBeDefined();
          expect(res.body.email).toBeDefined();
          expect(res.body.email).toBe(email);
      })
      .end((err)=>{
          if(err){
             return done(err);
          }
          User.findOne({email:email}).then((user)=>{
              expect(user).toBeDefined();
              expect(user.password).toNotEqual(password); //bec password will be hashed..
              done();
          }).catch((e)=>done(e));
      });
    });
 
    it('if invalid email/password',(done)=>{
        request(app)
        .post('/users')
        .send({email:'as',password:'123'})
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use',(done)=>{
        request(app)
        .post('/users')
        .send({email:users[0].email,password:users[0].password})
        .expect(400)
        .end(done);
    })
});

describe('/users/login',()=>{
    it('should login user and return auth token',(done)=>{
       request(app)
       .post('/users/login')
       .send({email:users[1].email,password:users[1].password})
       .expect(200)
       .expect((res)=>{
            expect(res.headers['x-auth']).toBeDefined();
       })
       .end((err,res)=>{
           if(err){
               return done(err);
           }

           User.findById(users[1]._id).then((user)=>{
               expect(user.toObject().tokens[0]).toMatchObject({
                 access:'auth',
                 token:res.headers['x-auth']
               });
               done();
           }).catch((e)=>done(e));
       })
    });

    it('should reject invalid email login',(done)=>{
        request(app)
        .post('/users/login')
        .send({email:'xyz@gmail.com',password:'123456'})
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeUndefined();
        })
        .end(done);
    });

    it('should reject invalid password login',(done)=>{
       request(app)
       .post('/users/login')
       .send({email:users[1].email,password:users[1].password+'2'})
       .expect(400)
       .expect((res)=>{
            expect(res.headers['x-auth']).toBeUndefined();
       })
       .end((err,res)=>{
           if(err){
               return done(err);
           }

           User.findById(users[1]._id).then((user)=>{
               expect(user.tokens.length).toEqual(0);
               done();
           }).catch((e)=>done(e));
       })
    });
})


