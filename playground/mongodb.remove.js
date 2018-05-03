const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('unable to connect mongo db server!!');
    }
    console.log('connected to mongo db server!!!');
    // deleteMany
    // db.collection('Todos').deleteMany({text:'eat lunch'}).then((result)=>{
    //     console.log(result);
    // });
    
    // deleteOne
    // db.collection('Todos').deleteOne({text:'eat lunch'}).then((result)=>{
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({available:false}).then((result)=>{
    //     console.log(result);
    // });

    // db.collection('Users').deleteMany({name:'khan'}).then((result)=>{
    //     console.log(result);
    // });

    // findOneAndDelete
    db.collection('Users').findOneAndDelete({_id:new ObjectID("5ae9328f711f6e1f907aa2b5")}).then((result)=>{
        console.log(result);
    });

    // db.close();
});