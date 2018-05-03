const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('unable to connect mongo db server!!');
    }
    console.log('connected to mongo db server!!!');
    db.collection('Todos').insertOne({
        book: 'anthony the great!!',
        available: true
    }, (error, result) => {
        if (error) {
            return console.log('unable to add to Todos');
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'billy',
        age: 27,
        location: 'new york city'
    }, (error, result) => {
        if (error) {
            return console.log('unable to insert user', error);
        }
        console.log(result.ops);
    });
    db.close();
});