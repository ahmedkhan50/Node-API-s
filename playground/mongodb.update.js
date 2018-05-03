const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('unable to connect mongo db server!!');
    }
    console.log('connected to mongo db server!!!');

    // findOneAndDelete
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5ae93090ded9ef108c88bda3")
    // },
    //     {
    //         $set: {
    //             available: false
    //         }
    //     },
    //     {
    //         returnOriginal: false
    //     }).then((result) => {
    //         console.log(result);
    //     });

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5ae93090ded9ef108c88bda3")
    },
        {
            $set: {
                book: 'nabeel is faggot!!'
            },
            $inc: {
                age: 2
            }

        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    // db.close();
});