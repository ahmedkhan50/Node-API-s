const request = require('supertest');
const expect = require('expect');

const app = require('../server').app;
const Todo = require('../models/todo').Todo;

beforeEach((done) => {
    Todo.remove({}).then(() => done());
})

describe('/todos post call test', () => {

     it('it should create a new toDo',(done)=>{
         var text = 'it should send data';

         request(app)
         .post('/todos')
         .send({text:text})
         .expect(200)
         .expect((res)=>{
             expect(res.body.text).toBe(text);
         })
         .end((error,res)=>{
             if(error){
                return done(error);
             }

             Todo.find().then((todos)=>{
                 expect(todos.length).toBe(1);
                 expect(todos[0].text).toBe(text);
                 done();
             }).catch(error=> done(error));
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch(error => done(error));
            });
    });

});


