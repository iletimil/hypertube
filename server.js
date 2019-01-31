import { MongoClient } from 'mongodb';
var url = "mongodb://locahost:27017/hypertube";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created");
    db.close();
});