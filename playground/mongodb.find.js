const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('unable to connect mongo db server!!');
    }
    console.log('connected to mongo db server!!!');
    // db.collection('Todos').find({_id:new ObjectID('5ae93e5b23bf857c514242e5')}).toArray().then((docs)=>{
    //    console.log(`toDos`);
    //    console.log(JSON.stringify(docs,undefined,2));
    // },(error)=>{
    //     console.log('unable to fetch Todos from TodoApp',error);
    // });
    // db.collection('Todos').find().count().then((count)=>{
    //    console.log(`ToDos count ${count}`);
    // },(error)=>{
    //     console.log('unable to fetch count from TodoApp',error);
    // });

    db.collection('Users').find({name:'khan'}).toArray().then((docs)=>{
       console.log('docs are',JSON.stringify(docs,undefined,2));
    },(error)=>{
        console.log('unable to fetch data from TodoApp',error);
    });
    // db.close();
});